import { Plus, Wand2, LayoutGrid, Trash2, LogOut, Loader2, CheckCircle2, AlertCircle, Sparkles, BookmarkPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
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
    boardLabel?: string;
    isScratch?: boolean;
    onSaveToHistory?: () => void;
    saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
}

export function BoardToolbar({ onAddIdea, onClearBoard, onSummaryClick, onAutoConnect, autoConnectStatus, boardLabel, isScratch, onSaveToHistory, saveStatus = 'idle' }: BoardToolbarProps) {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    const status = autoConnectStatus ?? { state: 'idle' as const };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); } catch (_) {}
        }

        const verifyUser = async () => {
            try {
                const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
                const data = await res.json();
                if (data.success && data.data) {
                    setUser(data.data);
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

    // Auto Connect button style per state
    const autoConnectStyle: Record<string, React.CSSProperties> = {
        idle:    { background: 'var(--color-primary)', boxShadow: '0 0 14px rgba(124,111,255,0.4)' },
        loading: { background: 'rgba(124,111,255,0.4)', cursor: 'wait' },
        done:    { background: '#10b981', boxShadow: '0 0 14px rgba(16,185,129,0.4)' },
        error:   { background: '#ef4444', boxShadow: '0 0 14px rgba(239,68,68,0.3)' },
    };

    const btnLabel: Record<string, string> = {
        idle:    'Auto Connect',
        loading: 'Thinking…',
        done:    `+${status.created ?? 0} Links`,
        error:   'Failed',
    };

    const pillStyle: React.CSSProperties = {
        background: 'rgba(13,17,32,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '0.5px solid rgba(124,111,255,0.15)',
        borderRadius: 999,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    };

    const toolBtnStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        borderRadius: 999,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--color-muted)',
        transition: 'background 0.2s, color 0.2s',
    };

    return (
        <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 40, width: '100%', maxWidth: '1400px', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {/* ── Main toolbar ── */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                {/* Left: User chip */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', ...pillStyle }}>
                    {user?.photo ? (
                        <img src={user.photo} alt="Profile" style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(124,111,255,0.4)' }} />
                    ) : (
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(124,111,255,0.15)', border: '1px solid rgba(124,111,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 11, color: 'var(--color-primary)' }}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column' }} className="hidden md:flex">
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.2 }}>{user?.name || 'User'}</span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'var(--color-muted)' }}>{user?.email || ''}</span>
                    </div>
                    <div style={{ width: 1, height: 20, background: 'rgba(124,111,255,0.15)', margin: '0 4px' }} className="hidden md:block" />
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        style={{ ...toolBtnStyle, padding: '4px' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)'; }}
                    >
                        <LogOut style={{ width: 14, height: 14 }} />
                    </button>
                </div>

                {/* Center: Actions pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 16px', ...pillStyle }}>
                    {/* Board label */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="hidden sm:flex">
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13, color: 'var(--color-text)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={boardLabel}>
                            {boardLabel ?? 'Visual Board'}
                        </span>
                        {isScratch && (
                            <span style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: 10,
                                marginTop: 1,
                                color: saveStatus === 'saved' ? '#10b981' : saveStatus === 'error' ? '#ef4444' : saveStatus === 'saving' ? 'var(--color-primary)' : '#f59e0b',
                            }}>
                                {saveStatus === 'saving' ? '⏳ Saving…' : saveStatus === 'saved' ? '✓ Saved' : saveStatus === 'error' ? '✗ Failed' : '✦ Temporary'}
                            </span>
                        )}
                    </div>
                    <div style={{ width: 1, height: 20, background: 'rgba(124,111,255,0.15)', margin: '0 8px' }} className="hidden sm:block" />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Add Idea */}
                        <button
                            onClick={onAddIdea}
                            style={toolBtnStyle}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,111,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)'; }}
                        >
                            <Plus style={{ width: 14, height: 14 }} />
                            <span className="hidden md:block">Add Idea</span>
                        </button>

                        {/* Save to History (scratch mode) */}
                        {isScratch && onSaveToHistory && (
                            <button
                                onClick={onSaveToHistory}
                                disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                                style={{
                                    ...toolBtnStyle,
                                    background: saveStatus === 'saved' ? 'rgba(16,185,129,0.2)' : saveStatus === 'error' ? 'rgba(239,68,68,0.2)' : saveStatus === 'saving' ? 'rgba(124,111,255,0.2)' : 'rgba(124,111,255,0.15)',
                                    color: 'var(--color-text)',
                                    cursor: saveStatus === 'saving' || saveStatus === 'saved' ? 'not-allowed' : 'pointer',
                                }}
                                title="Save this scratch session to Chat History"
                            >
                                {saveStatus === 'saving' ? <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> :
                                 saveStatus === 'saved'  ? <CheckCircle2 style={{ width: 14, height: 14 }} /> :
                                 saveStatus === 'error'  ? <AlertCircle style={{ width: 14, height: 14 }} /> :
                                 <BookmarkPlus style={{ width: 14, height: 14 }} />}
                                <span className="hidden md:block">
                                    {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Retry' : 'Save to History'}
                                </span>
                            </button>
                        )}

                        {/* Auto Connect */}
                        {onAutoConnect && (
                            <button
                                id="auto-connect-btn"
                                onClick={onAutoConnect}
                                disabled={status.state === 'loading'}
                                style={{
                                    ...toolBtnStyle,
                                    ...autoConnectStyle[status.state],
                                    color: 'white',
                                }}
                            >
                                {status.state === 'loading' && <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" />}
                                {status.state === 'done'    && <CheckCircle2 style={{ width: 14, height: 14 }} />}
                                {status.state === 'error'   && <AlertCircle style={{ width: 14, height: 14 }} />}
                                {status.state === 'idle'    && <Wand2 style={{ width: 14, height: 14 }} />}
                                <span className="hidden md:block">{btnLabel[status.state]}</span>
                            </button>
                        )}

                        {/* Summary */}
                        <button
                            onClick={onSummaryClick}
                            style={toolBtnStyle}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,111,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)'; }}
                        >
                            <LayoutGrid style={{ width: 14, height: 14 }} />
                            <span className="hidden md:block">Summary</span>
                        </button>

                        {/* Clear */}
                        <button
                            onClick={onClearBoard}
                            style={{ ...toolBtnStyle }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)'; }}
                        >
                            <Trash2 style={{ width: 14, height: 14 }} />
                            <span className="hidden md:block">Clear</span>
                        </button>
                    </div>
                </div>

                {/* Right placeholder for balance */}
                <div style={{ width: 160 }} />
            </div>

            {/* ── Status toast ── */}
            <AnimatePresence>
                {status.state !== 'idle' && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '8px 20px',
                            borderRadius: 999,
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13,
                            fontWeight: 500,
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '0.5px solid',
                            ...(status.state === 'loading'
                                ? { background: 'rgba(124,111,255,0.15)', borderColor: 'rgba(124,111,255,0.3)', color: 'var(--color-primary)' }
                                : status.state === 'done' && (status.created ?? 0) > 0
                                ? { background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' }
                                : status.state === 'done'
                                ? { background: 'rgba(255,255,255,0.05)', borderColor: 'var(--color-border)', color: 'var(--color-muted)' }
                                : { background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)', color: '#f87171' })
                        }}
                    >
                        {status.state === 'loading' && <><Loader2 style={{ width: 14, height: 14 }} className="animate-spin flex-shrink-0" /><span>AI is analyzing your ideas and finding meaningful links…</span></>}
                        {status.state === 'done' && (status.created ?? 0) > 0 && (
                            <><Sparkles style={{ width: 14, height: 14, flexShrink: 0 }} /><span><strong>{status.created}</strong> new connection{status.created !== 1 ? 's' : ''} discovered!{(status.skipped ?? 0) > 0 && <span style={{ opacity: 0.6, marginLeft: 6 }}>· {status.skipped} already existed</span>}</span></>
                        )}
                        {status.state === 'done' && (status.created ?? 0) === 0 && (
                            <><CheckCircle2 style={{ width: 14, height: 14, flexShrink: 0 }} /><span>{status.message || 'No new connections found.'}</span></>
                        )}
                        {status.state === 'error' && (
                            <><AlertCircle style={{ width: 14, height: 14, flexShrink: 0 }} /><span>{status.message || 'Something went wrong. Please try again.'}</span></>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
