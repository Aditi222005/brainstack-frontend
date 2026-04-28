
const BASE_URL = 'http://localhost:5000/api';

// ── In-flight refresh tracking ───────────────────────────────────────────────
let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

const drainQueue = () => { pendingQueue.forEach((r) => r()); pendingQueue = []; };
const clearQueue = () => { pendingQueue = []; };

// ── Core request helper ──────────────────────────────────────────────────────
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiOptions {
    body?: unknown;
    headers?: Record<string, string>;
}

async function request<T = unknown>(
    method: Method,
    path: string,
    options: ApiOptions = {},
    /** internal — marks the second attempt after a token refresh */
    _isRetry = false
): Promise<T> {
    const url = `${BASE_URL}${path}`;

    const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        body: options.body != null ? JSON.stringify(options.body) : undefined,
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) return data as T;

    // ── 401 handling with silent refresh ────────────────────────────────────
    if (res.status === 401 && !_isRetry) {
        const code: string = data?.code ?? '';

        // Step-Up required — surface to caller, do NOT auto-refresh
        if (code === 'REAUTH_REQUIRED') {
            const err = Object.assign(new Error(data?.message ?? 'Re-authentication required'), {
                status: 401,
                code,
                data,
            });
            throw err;
        }

        // Skip refresh if this IS the refresh call itself (prevent loops)
        if (path === '/auth/refresh') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error('Session expired');
        }

        // ── Silent token refresh ─────────────────────────────────────
        if (isRefreshing) {
            // Queue and wait for current refresh to finish
            return new Promise<T>((resolve, reject) => {
                pendingQueue.push(async () => {
                    try {
                        resolve(await request<T>(method, path, options, true));
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }

        isRefreshing = true;
        try {
            await request('POST', '/auth/refresh', {}, true);
            isRefreshing = false;
            drainQueue();
            return request<T>(method, path, options, true); // retry original
        } catch {
            isRefreshing = false;
            clearQueue();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error('Session expired — please log in again.');
        }
    }

    // ── All other errors ─────────────────────────────────────────────────────
    const err = Object.assign(new Error(data?.message ?? `HTTP ${res.status}`), {
        status: res.status,
        code: data?.code,
        data,
    });
    throw err;
}

// ── Public API ───────────────────────────────────────────────────────────────
const api = {
    get: <T = unknown>(path: string, opts?: ApiOptions) => request<T>('GET', path, opts),
    post: <T = unknown>(path: string, opts?: ApiOptions) => request<T>('POST', path, opts),
    put: <T = unknown>(path: string, opts?: ApiOptions) => request<T>('PUT', path, opts),
    patch: <T = unknown>(path: string, opts?: ApiOptions) => request<T>('PATCH', path, opts),
    delete: <T = unknown>(path: string, opts?: ApiOptions) => request<T>('DELETE', path, opts),
};

export default api;
