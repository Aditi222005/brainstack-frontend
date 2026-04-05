import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Sparkles, X } from 'lucide-react';
import { EDGE_TYPES, EDGE_TYPE_LIST, EdgeType } from './boardTheme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EdgeTypeSelectorProps {
    visible: boolean;
    position: { x: number; y: number };
    /** Suggested type + human reason from connectionSuggester */
    suggestion?: { type: EdgeType; reason: string } | null;
    onSelect: (type: EdgeType) => void;
    onCancel: () => void;
}

// ─── Connection Option Card ───────────────────────────────────────────────────

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
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            className={`
                w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left
                transition-all duration-150 group relative
                ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}
            `}
            style={isSelected
                ? { boxShadow: `0 0 0 1px ${config.color}55, inset 0 0 0 1px ${config.color}22` }
                : undefined
            }
        >
            {/* Color stripe */}
            <div className="flex flex-col items-center gap-1 pt-0.5 flex-shrink-0">
                <span className="text-base leading-none">{config.icon}</span>
                <div
                    className="w-0.5 h-8 rounded-full opacity-60"
                    style={{ background: `linear-gradient(to bottom, ${config.color}, transparent)` }}
                />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                        className="text-[13px] font-semibold leading-tight"
                        style={{ color: config.color }}
                    >
                        {config.label}
                    </span>
                    {isSuggested && (
                        <span
                            className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full"
                            style={{
                                backgroundColor: `${config.color}22`,
                                color: config.color,
                                border: `1px solid ${config.color}44`,
                            }}
                        >
                            suggested
                        </span>
                    )}
                </div>
                <p className="text-[11px] text-white/50 leading-snug">{config.description}</p>
                <p className="text-[10px] text-white/25 leading-snug mt-0.5 italic">{config.example}</p>
            </div>

            {/* Checkmark */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                        style={{ backgroundColor: config.color }}
                    >
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type UIState = 'suggestion' | 'picking';

export function EdgeTypeSelector({
    visible,
    position,
    suggestion,
    onSelect,
    onCancel,
}: EdgeTypeSelectorProps) {
    const [uiState, setUIState] = useState<UIState>('suggestion');
    const [selectedType, setSelectedType] = useState<EdgeType | null>(null);

    // Reset state when the selector appears for a new connection
    useEffect(() => {
        if (visible) {
            setUIState(suggestion ? 'suggestion' : 'picking');
            setSelectedType(suggestion?.type ?? null);
        }
    }, [visible, suggestion]);

    // Safe viewport clamping
    const safeLeft = Math.min(position.x - 110, window.innerWidth - 310);
    const safeTop = Math.min(position.y - 20, window.innerHeight - 400);

    const handleConfirm = () => {
        if (selectedType) onSelect(selectedType);
    };

    const handleOptionClick = (type: EdgeType) => {
        setSelectedType(type);
        // In 'picking' view, single click → select & confirm instantly
        if (uiState === 'picking') {
            onSelect(type);
        }
    };

    const suggestedConfig = suggestion ? EDGE_TYPES[suggestion.type] : null;

    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[60]"
                        onClick={onCancel}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 12 }}
                        transition={{ type: 'spring', stiffness: 460, damping: 28 }}
                        className="fixed z-[70] w-72 rounded-2xl overflow-hidden shadow-[0_16px_60px_rgba(0,0,0,0.7)]"
                        style={{
                            left: safeLeft,
                            top: safeTop,
                            background: 'linear-gradient(145deg, rgba(17,24,39,0.98), rgba(10,14,26,0.98))',
                            border: '1px solid rgba(255,255,255,0.07)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        {/* ── Header ── */}
                        <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                </div>
                                <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">
                                    How are these connected?
                                </span>
                            </div>
                            <button
                                onClick={onCancel}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/10 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {/* ── STATE: SUGGESTION STEP ── */}
                            {uiState === 'suggestion' && suggestion && suggestedConfig && (
                                <motion.div
                                    key="suggestion"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.18 }}
                                    className="p-4"
                                >
                                    {/* AI reason chip */}
                                    <div className="flex items-start gap-2 mb-4">
                                        <div className="text-base flex-shrink-0 mt-0.5">🤖</div>
                                        <p className="text-[11px] text-white/45 leading-relaxed">
                                            {suggestion.reason}
                                        </p>
                                    </div>

                                    {/* Suggested type card */}
                                    <div
                                        className="rounded-xl p-3.5 mb-4"
                                        style={{
                                            background: `linear-gradient(135deg, ${suggestedConfig.color}14, ${suggestedConfig.color}08)`,
                                            border: `1px solid ${suggestedConfig.color}30`,
                                        }}
                                    >
                                        <div className="flex items-center gap-2.5 mb-1.5">
                                            <span className="text-xl">{suggestedConfig.icon}</span>
                                            <div>
                                                <div
                                                    className="text-[14px] font-bold"
                                                    style={{ color: suggestedConfig.color }}
                                                >
                                                    {suggestedConfig.label}
                                                </div>
                                                <div className="text-[10px] uppercase tracking-widest text-white/25 font-medium">
                                                    Suggested for you
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-white/55 leading-snug">
                                            {suggestedConfig.description}
                                        </p>
                                        <p className="text-[10px] text-white/25 mt-1 italic">
                                            {suggestedConfig.example}
                                        </p>
                                    </div>

                                    {/* Line preview */}
                                    <svg width="100%" height="12" className="mb-4 overflow-visible">
                                        <line
                                            x1="12" y1="6" x2="calc(100% - 12)" y2="6"
                                            stroke={suggestedConfig.color}
                                            strokeWidth={2}
                                            strokeDasharray={suggestedConfig.dashArray === '0' ? 'none' : suggestedConfig.dashArray}
                                            strokeLinecap="round"
                                        />
                                        <circle cx="12" cy="6" r="3" fill={suggestedConfig.color} opacity="0.7" />
                                        <polygon
                                            points="calc(100% - 12),3 calc(100% - 4),6 calc(100% - 12),9"
                                            fill={suggestedConfig.color}
                                            opacity="0.8"
                                        />
                                    </svg>

                                    {/* Action buttons */}
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={handleConfirm}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[12px] font-bold text-white transition-all"
                                            style={{
                                                background: `linear-gradient(135deg, ${suggestedConfig.color}, ${suggestedConfig.color}cc)`,
                                                boxShadow: `0 4px 14px ${suggestedConfig.color}40`,
                                            }}
                                        >
                                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                            Looks right!
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setUIState('picking')}
                                            className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-[12px] font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all border border-white/10"
                                        >
                                            Change
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── STATE: FULL PICKER ── */}
                            {(uiState === 'picking' || !suggestion) && (
                                <motion.div
                                    key="picking"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.18 }}
                                >
                                    <p className="text-[11px] text-white/35 px-4 pt-3 pb-1">
                                        Pick the best description for this link:
                                    </p>
                                    <div className="flex flex-col gap-0.5 px-2 pb-3">
                                        {EDGE_TYPE_LIST.map((type) => (
                                            <ConnectionOption
                                                key={type}
                                                type={type}
                                                isSelected={selectedType === type}
                                                isSuggested={suggestion?.type === type}
                                                onClick={() => handleOptionClick(type)}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ── Footer hint ── */}
                        <div className="px-4 pb-3 pt-0 border-t border-white/[0.04] text-[9px] text-white/20 text-center">
                            Press Esc to cancel · Click anywhere outside to dismiss
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
