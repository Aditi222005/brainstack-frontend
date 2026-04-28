import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Sparkles, X } from 'lucide-react';
import { EDGE_TYPES, EDGE_TYPE_LIST, EdgeType } from './boardTheme';

interface EdgeTypeSelectorProps {
    visible: boolean;
    position: { x: number; y: number };
    suggestion?: { type: EdgeType; reason: string } | null;
    onSelect: (type: EdgeType) => void;
    onCancel: () => void;
}

interface ConnectionOptionProps {
    type: EdgeType;
    isSelected: boolean;
    isSuggested: boolean;
    onClick: () => void;
}

function ConnectionOption({ type, isSelected, isSuggested, onClick }: ConnectionOptionProps) {
    const config = EDGE_TYPES[type];
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.97 }}
            style={{
                width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '10px 12px', borderRadius: 10, textAlign: 'left', border: 'none',
                background: isSelected ? `${config.color}12` : 'transparent',
                outline: isSelected ? `0.5px solid ${config.color}40` : 'none',
                cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'; }}
            onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
            {/* Icon + gradient line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingTop: 2, flexShrink: 0 }}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>{config.icon}</span>
                <div style={{ width: 2, height: 28, borderRadius: 99, background: `linear-gradient(to bottom, ${config.color}, transparent)`, opacity: 0.6 }} />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 13, color: config.color }}>{config.label}</span>
                    {isSuggested && (
                        <span style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 600,
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            padding: '1px 6px', borderRadius: 99,
                            background: `${config.color}18`, color: config.color,
                            border: `0.5px solid ${config.color}40`,
                        }}>suggested</span>
                    )}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(232,234,240,0.45)', lineHeight: 1.5, margin: 0 }}>{config.description}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(232,234,240,0.22)', lineHeight: 1.4, margin: '3px 0 0', fontStyle: 'italic' }}>{config.example}</p>
            </div>

            {/* Checkmark */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                        style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: config.color, flexShrink: 0, marginTop: 2 }}
                    >
                        <Check style={{ width: 12, height: 12, color: '#fff' }} strokeWidth={3} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

type UIState = 'suggestion' | 'picking';

export function EdgeTypeSelector({ visible, position, suggestion, onSelect, onCancel }: EdgeTypeSelectorProps) {
    const [uiState, setUIState] = useState<UIState>('suggestion');
    const [selectedType, setSelectedType] = useState<EdgeType | null>(null);

    useEffect(() => {
        if (visible) { setUIState(suggestion ? 'suggestion' : 'picking'); setSelectedType(suggestion?.type ?? null); }
    }, [visible, suggestion]);

    const safeLeft = Math.min(position.x - 110, window.innerWidth - 310);
    const safeTop  = Math.min(position.y - 20,  window.innerHeight - 420);

    const handleConfirm = () => { if (selectedType) onSelect(selectedType); };
    const handleOptionClick = (type: EdgeType) => {
        setSelectedType(type);
        if (uiState === 'picking') onSelect(type);
    };

    const suggestedConfig = suggestion ? EDGE_TYPES[suggestion.type] : null;

    const panelStyle: React.CSSProperties = {
        position: 'fixed', zIndex: 70,
        width: 288, borderRadius: 16,
        background: 'rgba(11,15,26,0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '0.5px solid rgba(124,111,255,0.2)',
        boxShadow: '0 16px 64px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        left: safeLeft, top: safeTop,
    };

    return (
        <AnimatePresence>
            {visible && (
                <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 60 }} onClick={onCancel} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 10 }}
                        transition={{ type: 'spring', stiffness: 460, damping: 28 }}
                        style={panelStyle}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 10px', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 24, height: 24, borderRadius: 8, background: 'rgba(124,111,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Sparkles style={{ width: 13, height: 13, color: 'var(--color-primary)' }} />
                                </div>
                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(232,234,240,0.6)' }}>
                                    How are these connected?
                                </span>
                            </div>
                            <button onClick={onCancel} style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(232,234,240,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s, background 0.2s' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(232,234,240,0.7)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(232,234,240,0.25)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                            >
                                <X style={{ width: 13, height: 13 }} />
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {/* SUGGESTION VIEW */}
                            {uiState === 'suggestion' && suggestion && suggestedConfig && (
                                <motion.div key="suggestion"
                                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.18 }} style={{ padding: 16 }}
                                >
                                    {/* AI reason */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 14 }}>
                                        <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>🤖</span>
                                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(232,234,240,0.4)', lineHeight: 1.55, margin: 0 }}>{suggestion.reason}</p>
                                    </div>

                                    {/* Suggested card */}
                                    <div style={{ borderRadius: 12, padding: '12px 14px', marginBottom: 14, background: `linear-gradient(135deg, ${suggestedConfig.color}12, ${suggestedConfig.color}06)`, border: `0.5px solid ${suggestedConfig.color}35` }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                            <span style={{ fontSize: 18 }}>{suggestedConfig.icon}</span>
                                            <div>
                                                <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14, color: suggestedConfig.color }}>{suggestedConfig.label}</div>
                                                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(232,234,240,0.25)' }}>Suggested for you</div>
                                            </div>
                                        </div>
                                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(232,234,240,0.5)', lineHeight: 1.5, margin: 0 }}>{suggestedConfig.description}</p>
                                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(232,234,240,0.22)', margin: '4px 0 0', fontStyle: 'italic' }}>{suggestedConfig.example}</p>
                                    </div>

                                    {/* Line preview */}
                                    <svg width="100%" height="12" style={{ marginBottom: 14, overflow: 'visible' }}>
                                        <line x1="12" y1="6" x2="calc(100% - 12)" y2="6" stroke={suggestedConfig.color} strokeWidth={1.5} strokeDasharray={suggestedConfig.dashArray === '0' ? undefined : suggestedConfig.dashArray} strokeLinecap="round" />
                                        <circle cx="12" cy="6" r="3" fill={suggestedConfig.color} opacity="0.7" />
                                        <polygon points="calc(100% - 12),3 calc(100% - 4),6 calc(100% - 12),9" fill={suggestedConfig.color} opacity="0.8" />
                                    </svg>

                                    {/* Action buttons */}
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleConfirm}
                                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 12px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: '#fff', background: `linear-gradient(135deg, ${suggestedConfig.color}, ${suggestedConfig.color}cc)`, boxShadow: `0 4px 14px ${suggestedConfig.color}35` }}>
                                            <Check style={{ width: 13, height: 13 }} strokeWidth={3} />
                                            Looks right!
                                        </motion.button>
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setUIState('picking')}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '8px 12px', borderRadius: 999, border: '0.5px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 12, color: 'rgba(232,234,240,0.5)', background: 'transparent', transition: 'color 0.2s, background 0.2s' }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(232,234,240,0.8)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(232,234,240,0.5)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                                        >
                                            Change
                                            <ChevronRight style={{ width: 13, height: 13 }} />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {/* PICKER VIEW */}
                            {(uiState === 'picking' || !suggestion) && (
                                <motion.div key="picking"
                                    initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                                    transition={{ duration: 0.18 }}
                                >
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(232,234,240,0.32)', padding: '10px 16px 6px', margin: 0 }}>
                                        Pick the best description for this link:
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px 12px' }}>
                                        {EDGE_TYPE_LIST.map(type => (
                                            <ConnectionOption key={type} type={type} isSelected={selectedType === type} isSuggested={suggestion?.type === type} onClick={() => handleOptionClick(type)} />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Footer */}
                        <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.04)', padding: '8px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(232,234,240,0.2)', textAlign: 'center' }}>
                            Esc to cancel · Click outside to dismiss
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
