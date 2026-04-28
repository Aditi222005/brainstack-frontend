

import { useState, useCallback, useRef } from 'react';
import api from '@/lib/api';

interface ReAuthState {
    isOpen: boolean;
    loading: boolean;
    error: string;
}

interface UseReAuthReturn extends ReAuthState {
    /** Opens the modal and returns a promise that resolves to true on success, false on cancel */
    prompt: () => Promise<boolean>;
    /** Submit password for step-up re-auth */
    confirm: (password: string) => Promise<void>;
    /** Dismiss the modal without completing re-auth */
    cancel: () => void;
}

export const useReAuth = (): UseReAuthReturn => {
    const [state, setState] = useState<ReAuthState>({
        isOpen: false,
        loading: false,
        error: '',
    });

    // Store resolve so confirm/cancel can settle the promise
    const resolveRef = useRef<((value: boolean) => void) | null>(null);

    const prompt = useCallback((): Promise<boolean> => {
        setState({ isOpen: true, loading: false, error: '' });

        return new Promise<boolean>((resolve) => {
            resolveRef.current = resolve;
        });
    }, []);

    const confirm = useCallback(async (password: string): Promise<void> => {
        setState((prev) => ({ ...prev, loading: true, error: '' }));

        try {
            await api.post('/auth/re-authenticate', { body: { password } });
            setState({ isOpen: false, loading: false, error: '' });
            resolveRef.current?.(true);
            resolveRef.current = null;
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Re-authentication failed. Please try again.';
            setState((prev) => ({ ...prev, loading: false, error: message }));
            // Don't resolve — let the user retry or cancel
        }
    }, []);

    const cancel = useCallback((): void => {
        setState({ isOpen: false, loading: false, error: '' });
        resolveRef.current?.(false);
        resolveRef.current = null;
    }, []);

    return { ...state, prompt, confirm, cancel };
};
