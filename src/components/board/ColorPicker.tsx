import { motion, AnimatePresence } from 'framer-motion';
import { NODE_COLORS, NodeColor } from './boardTheme';
import { useState } from 'react';

interface ColorPickerProps {
    currentColor: NodeColor;
    onChange: (color: NodeColor) => void;
}

const COLOR_LIST: NodeColor[] = ['blue', 'purple', 'green', 'yellow', 'red', 'orange', 'pink'];

export function ColorPicker({ currentColor, onChange }: ColorPickerProps) {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ position: 'relative' }}>
            {/* Trigger dot */}
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                style={{
                    width: 14, height: 14, borderRadius: '50%',
                    backgroundColor: NODE_COLORS[currentColor].dot,
                    border: '1.5px solid rgba(255,255,255,0.15)',
                    cursor: 'pointer', flexShrink: 0, padding: 0,
                    boxShadow: `0 0 8px ${NODE_COLORS[currentColor].dot}60`,
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                title={NODE_COLORS[currentColor].label}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.25)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            />

            <AnimatePresence>
                {open && (
                    <>
                        <div style={{ position: 'fixed', inset: 0, zIndex: 55 }} onClick={() => setOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: -4 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            style={{
                                position: 'absolute', right: 0, top: 20, zIndex: 60,
                                background: 'rgba(13,17,32,0.97)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                border: '0.5px solid rgba(124,111,255,0.2)',
                                borderRadius: 12,
                                padding: 8,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                                minWidth: 144,
                            }}
                        >
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(232,234,240,0.3)', padding: '4px 8px 6px' }}>
                                Status
                            </div>
                            {COLOR_LIST.map((color) => {
                                const config = NODE_COLORS[color];
                                const isActive = color === currentColor;
                                return (
                                    <button
                                        key={color}
                                        onClick={(e) => { e.stopPropagation(); onChange(color); setOpen(false); }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            width: '100%', padding: '6px 8px', borderRadius: 8,
                                            border: 'none', cursor: 'pointer', textAlign: 'left',
                                            background: isActive ? 'rgba(124,111,255,0.1)' : 'transparent',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                                        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                                    >
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, backgroundColor: config.dot, boxShadow: isActive ? `0 0 8px ${config.dot}` : 'none' }} />
                                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: isActive ? 'var(--color-text)' : 'rgba(232,234,240,0.55)', flex: 1 }}>
                                            {config.label}
                                        </span>
                                        {isActive && <span style={{ color: 'rgba(124,111,255,0.7)', fontSize: 10 }}>✓</span>}
                                    </button>
                                );
                            })}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
