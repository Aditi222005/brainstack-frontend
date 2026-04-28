/**
 * useSilentRefresh.ts
 *
 * Fires a silent token refresh every REFRESH_INTERVAL milliseconds
 * while the user has an active session (localStorage has 'user').
 *
 * Keeps the 15-min access token alive without the user noticing.
 * On definitive auth failure (401/403) it clears local state and
 * redirects to /login. Transient errors (network, 5xx) are silently
 * ignored — the next interval will try again.
 */

import { useEffect, useRef } from 'react';
import api from '@/lib/api';

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

export const useSilentRefresh = () => {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const refresh = async () => {
        const user = localStorage.getItem('user');
        if (!user) return; // not logged in — skip

        try {
            const data = await api.post<{ data?: { token?: string } }>('/auth/refresh');
            if (data?.data?.token) {
                localStorage.setItem('token', data.data.token);
            }
        } catch (err: unknown) {
            const status = (err as { status?: number })?.status;
            // Definitive failures — force logout
            if (status === 401 || status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            // Transient errors (network, 500) — stay alive, retry next cycle
        }
    };

    useEffect(() => {
        // Fire immediately on mount
        refresh();

        intervalRef.current = setInterval(refresh, REFRESH_INTERVAL);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
