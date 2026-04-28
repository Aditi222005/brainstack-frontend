

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldAlert, X, Eye, EyeOff } from 'lucide-react';

interface ReAuthModalProps {
    isOpen: boolean;
    loading: boolean;
    error: string;
    onConfirm: (password: string) => Promise<void>;
    onCancel: () => void;
}

const ReAuthModal = ({ isOpen, loading, error, onConfirm, onCancel }: ReAuthModalProps) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!password.trim()) return;
        await onConfirm(password);
        setPassword('');
    };

    const handleCancel = () => {
        setPassword('');
        onCancel();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
                        onClick={handleCancel}
                    >
                        {/* Modal card — stop propagation so clicks inside don't close */}
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-md rounded-2xl border border-white/10 p-8 shadow-2xl"
                            style={{
                                background: 'linear-gradient(135deg, hsl(220 20% 10%) 0%, hsl(220 20% 7%) 100%)',
                            }}
                        >
                            {/* Close button */}
                            <button
                                onClick={handleCancel}
                                id="reauth-cancel-btn"
                                className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {/* Icon */}
                            <div className="flex justify-center mb-5">
                                <div
                                    className="p-4 rounded-full"
                                    style={{
                                        background: 'linear-gradient(135deg, hsl(38 92% 50% / 0.15), hsl(38 92% 50% / 0.05))',
                                        border: '1px solid hsl(38 92% 50% / 0.3)',
                                    }}
                                >
                                    <ShieldAlert className="h-7 w-7 text-amber-400" />
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-xl font-semibold text-center text-foreground mb-1">
                                Confirm Your Identity
                            </h2>
                            <p className="text-sm text-center text-muted-foreground mb-6">
                                This action requires elevated privileges.
                                <br />
                                Please re-enter your password to continue.
                            </p>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-4 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="reauth-password-input"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoFocus
                                        className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        id="reauth-confirm-btn"
                                        type="submit"
                                        disabled={loading || !password.trim()}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-black transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                        style={{
                                            background: loading
                                                ? 'hsl(38 92% 50% / 0.5)'
                                                : 'linear-gradient(135deg, hsl(38 92% 55%), hsl(38 92% 45%))',
                                            boxShadow: '0 4px 15px hsl(38 92% 50% / 0.25)',
                                        }}
                                    >
                                        {loading ? 'Verifying…' : 'Confirm Identity'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ReAuthModal;
