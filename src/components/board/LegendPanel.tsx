import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Info } from 'lucide-react';
import { EDGE_TYPES, EDGE_TYPE_LIST, NODE_COLORS, NodeColor } from './boardTheme';

const COLOR_LIST: NodeColor[] = ['blue', 'purple', 'green', 'yellow', 'red', 'orange', 'pink'];

export function LegendPanel() {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 40 }}>
            {/* Toggle button */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: 36, height: 36, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: open ? 'rgba(124,111,255,0.15)' : 'rgba(11,15,26,0.80)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: `0.5px solid ${open ? 'rgba(124,111,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    color: open ? 'var(--color-primary)' : 'rgba(232,234,240,0.35)',
                    cursor: 'pointer',
                    transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                    boxShadow: open ? '0 0 16px rgba(124,111,255,0.25)' : '0 2px 8px rgba(0,0,0,0.3)',
                }}
                title="Toggle Legend"
                onMouseEnter={e => {
                    if (!open) {
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-primary)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(124,111,255,0.3)';
                    }
                }}
                onMouseLeave={e => {
                    if (!open) {
                        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(232,234,240,0.35)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    }
                }}
            >
                <Info style={{ width: 15, height: 15 }} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                        style={{
                            position: 'absolute', right: 0, top: 44,
                            background: 'rgba(11,15,26,0.96)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            border: '0.5px solid rgba(124,111,255,0.18)',
                            borderRadius: 14,
                            padding: 16,
                            boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
                            width: 240,
                        }}
                    >
                        {/* Connection Types */}
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(232,234,240,0.28)', marginBottom: 10 }}>
                            Connections
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                            {EDGE_TYPE_LIST.map(type => {
                                const config = EDGE_TYPES[type];
                                return (
                                    <div key={type} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, marginTop: 2, flexShrink: 0 }}>
                                            <span style={{ fontSize: 13, lineHeight: 1 }}>{config.icon}</span>
                                            <svg width="2" height="10">
                                                <line x1="1" y1="0" x2="1" y2="10" stroke={config.color} strokeWidth={2}
                                                    strokeDasharray={config.dashArray === '0' ? undefined : config.dashArray} strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 11, color: config.color, marginBottom: 2 }}>{config.label}</div>
                                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(232,234,240,0.38)', lineHeight: 1.45 }}>{config.description}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Node Status */}
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(232,234,240,0.28)', marginBottom: 10 }}>
                            Node Status
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                            {COLOR_LIST.map(color => {
                                const config = NODE_COLORS[color];
                                return (
                                    <div key={color} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, backgroundColor: config.dot, boxShadow: `0 0 6px ${config.dot}60` }} />
                                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(232,234,240,0.55)' }}>{config.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
