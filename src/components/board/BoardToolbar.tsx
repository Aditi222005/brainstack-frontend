import { Plus, Wand2, LayoutGrid, Trash2, LogOut, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://localhost:5000/api';

interface AutoConnectStatus {
    state: 'idle' | 'loading' | 'done' | 'error';
    message?: string;
    created?: number;
    skipped?: number;
}

interface BoardToolbarProps {
    onAddIdea?: () => void;
    onClearBoard?: () => void;
    onSummaryClick?: () => void;
    onAutoConnect?: () => void;
    autoConnectStatus?: AutoConnectStatus;
}

export function BoardToolbar({ onAddIdea, onClearBoard, onSummaryClick, onAutoConnect, autoConnectStatus }: BoardToolbarProps) {
    const [user, setUser] = useState<any>(null);
    const [projectName, setProjectName] = useState('Brainstack Architect');
    const navigate = useNavigate();
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const status = autoConnectStatus ?? { state: 'idle' as const };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            if (parsedUser.projectName) setProjectName(parsedUser.projectName);
        }

        const verifyUser = async () => {
            try {
                const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
                const data = await res.json();
                if (data.success && data.data) {
                    setUser(data.data);
                    if (data.data.projectName) setProjectName(data.data.projectName);
                    localStorage.setItem('user', JSON.stringify(data.data));
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            } catch (error) {
                console.error('[BoardToolbar] Auth verification failed:', error);
            }
        };
        verifyUser();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
        } catch (error) {
            console.error('Logout failed', error);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setProjectName(newName);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(async () => {
            try {
                await fetch(`${API_BASE}/auth/project-name`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ projectName: newName }),
                });
            } catch (err) {
                console.error('Failed to update project name', err);
            }
        }, 800);
    };

    // Auto Connect button appearance by state
    const btnClass: Record<string, string> = {
        idle:    'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]',
        loading: 'bg-indigo-700/60 cursor-wait',
        done:    'bg-gradient-to-r from-emerald-600 to-cyan-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]',
        error:   'bg-gradient-to-r from-red-700 to-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    };

    const btnLabel: Record<string, string> = {
        idle:    'Auto Connect',
        loading: 'Thinking…',
        done:    `+${status.created ?? 0} Links`,
        error:   'Failed',
    };

    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-7xl px-8 flex flex-col items-center gap-2">
            {/* ── Main toolbar row ── */}
            <div className="w-full flex justify-between items-center">

                {/* Left: User chip */}
                <div className="flex items-center gap-3 bg-[#111827]/70 backdrop-blur-xl border border-indigo-500/15 px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    {user?.photo ? (
                        <img src={user.photo} alt="Profile" className="w-8 h-8 rounded-full border border-indigo-500/40" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-sm font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    )}
                    <div className="hidden md:flex flex-col">
                        <span className="text-[#E5E7EB] text-sm font-semibold leading-none">{user?.name || 'User'}</span>
                        <span className="text-[#E5E7EB]/40 text-xs">{user?.email || ''}</span>
                    </div>
                    <div className="w-px h-6 bg-indigo-500/15 mx-2 hidden md:block" />
                    <button onClick={handleLogout} className="text-[#E5E7EB]/40 hover:text-red-400 transition-colors p-1" title="Logout">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>

                {/* Center: Actions pill */}
                <div className="flex items-center gap-4 bg-[#111827]/70 backdrop-blur-xl border border-indigo-500/15 px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    <input
                        type="text"
                        value={projectName}
                        onChange={handleProjectNameChange}
                        className="bg-transparent text-[#E5E7EB] border-none outline-none font-medium w-40 text-lg hidden sm:block"
                        placeholder="Project Name"
                    />
                    <div className="w-px h-6 bg-indigo-500/15 mx-2 hidden sm:block" />

                    <div className="flex items-center gap-2">
                        {/* Add Idea */}
                        <button
                            onClick={onAddIdea}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-500/15 rounded-full text-indigo-200 transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden md:block">Add Idea</span>
                        </button>

                        {/* ✨ Auto Connect — fully wired */}
                        <button
                            id="auto-connect-btn"
                            onClick={onAutoConnect}
                            disabled={status.state === 'loading'}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-white transition-all text-sm font-medium ${btnClass[status.state]}`}
                        >
                            {status.state === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                            {status.state === 'done'    && <CheckCircle2 className="w-4 h-4" />}
                            {status.state === 'error'   && <AlertCircle className="w-4 h-4" />}
                            {status.state === 'idle'    && <Wand2 className="w-4 h-4" />}
                            <span className="hidden md:block">{btnLabel[status.state]}</span>
                        </button>

                        {/* Summary */}
                        <button
                            onClick={onSummaryClick}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-500/15 rounded-full text-indigo-200 transition-colors text-sm font-medium"
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span className="hidden md:block">Summary</span>
                        </button>

                        {/* Clear */}
                        <button
                            onClick={onClearBoard}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/15 rounded-full text-red-300 transition-colors text-sm font-medium group"
                        >
                            <Trash2 className="w-4 h-4 group-hover:text-red-400" />
                            <span className="hidden md:block">Clear</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Status toast below toolbar ── */}
            <AnimatePresence>
                {status.state !== 'idle' && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                        className={`flex items-center gap-3 px-5 py-2.5 rounded-full text-sm font-medium shadow-2xl backdrop-blur-xl border
                            ${status.state === 'loading'
                                ? 'bg-indigo-950/80 border-indigo-500/30 text-indigo-200'
                                : status.state === 'done' && (status.created ?? 0) > 0
                                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200'
                                : status.state === 'done'
                                ? 'bg-[#111827]/80 border-white/10 text-white/50'
                                : 'bg-red-950/80 border-red-500/30 text-red-200'
                            }`}
                    >
                        {status.state === 'loading' && (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-400 flex-shrink-0" />
                                <span>AI is analyzing your ideas and finding meaningful links…</span>
                            </>
                        )}
                        {status.state === 'done' && (status.created ?? 0) > 0 && (
                            <>
                                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span>
                                    <strong>{status.created}</strong> new connection{status.created !== 1 ? 's' : ''} discovered!
                                    {(status.skipped ?? 0) > 0 && (
                                        <span className="text-emerald-400/60 ml-1.5">· {status.skipped} already existed</span>
                                    )}
                                </span>
                            </>
                        )}
                        {status.state === 'done' && (status.created ?? 0) === 0 && (
                            <>
                                <CheckCircle2 className="w-4 h-4 text-white/40 flex-shrink-0" />
                                <span>{status.message || 'No new connections found.'}</span>
                            </>
                        )}
                        {status.state === 'error' && (
                            <>
                                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                <span>{status.message || 'Something went wrong. Please try again.'}</span>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
