import { motion, AnimatePresence } from 'framer-motion';
import { EDGE_TYPES, EDGE_TYPE_LIST, EdgeType } from './boardTheme';

interface EdgeTypeSelectorProps {
    visible: boolean;
    position: { x: number; y: number };
    onSelect: (type: EdgeType) => void;
    onCancel: () => void;
}

export function EdgeTypeSelector({ visible, position, onSelect, onCancel }: EdgeTypeSelectorProps) {
    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* Backdrop to catch clicks outside */}
                    <div
                        className="fixed inset-0 z-[60]"
                        onClick={onCancel}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="fixed z-[70] bg-[#111827]/95 backdrop-blur-xl border border-indigo-500/20 rounded-xl p-2 shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
                        style={{
                            left: Math.min(position.x - 100, window.innerWidth - 240),
                            top: Math.min(position.y - 20, window.innerHeight - 220),
                        }}
                    >
                        <div className="text-[10px] uppercase tracking-widest text-[#E5E7EB]/30 px-3 py-1.5 font-semibold">
                            Connection Type
                        </div>
                        <div className="flex flex-col gap-0.5">
                            {EDGE_TYPE_LIST.map((type) => {
                                const config = EDGE_TYPES[type];
                                return (
                                    <button
                                        key={type}
                                        onClick={() => onSelect(type)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left group"
                                    >
                                        <div
                                            className="w-8 h-0.5 rounded-full flex-shrink-0 transition-all group-hover:h-1"
                                            style={{
                                                backgroundColor: config.color,
                                                boxShadow: `0 0 8px ${config.glowColor}`,
                                            }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm text-[#E5E7EB]/90 font-medium leading-tight">
                                                {config.icon} {config.label}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
