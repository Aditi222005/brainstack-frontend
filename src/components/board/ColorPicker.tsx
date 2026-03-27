import { motion, AnimatePresence } from 'framer-motion';
import { NODE_COLORS, NodeColor } from './boardTheme';
import { useState } from 'react';

interface ColorPickerProps {
    currentColor: NodeColor;
    onChange: (color: NodeColor) => void;
}

const COLOR_LIST: NodeColor[] = ['blue', 'purple', 'green', 'yellow', 'red'];

export function ColorPicker({ currentColor, onChange }: ColorPickerProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            {/* Trigger dot */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                }}
                className="w-3.5 h-3.5 rounded-full border border-white/20 transition-all hover:scale-125 hover:border-white/40 flex-shrink-0"
                style={{ backgroundColor: NODE_COLORS[currentColor].dot }}
                title={NODE_COLORS[currentColor].label}
            />

            {/* Dropdown palette */}
            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-[55]" onClick={() => setOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -4 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute right-0 top-6 z-[60] bg-[#111827]/95 backdrop-blur-xl border border-indigo-500/20 rounded-xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] min-w-[140px]"
                        >
                            <div className="text-[9px] uppercase tracking-widest text-[#E5E7EB]/25 px-2 py-1 font-semibold">
                                Status
                            </div>
                            {COLOR_LIST.map((color) => {
                                const config = NODE_COLORS[color];
                                const isActive = color === currentColor;
                                return (
                                    <button
                                        key={color}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onChange(color);
                                            setOpen(false);
                                        }}
                                        className={`flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg transition-colors text-left text-xs
                                            ${isActive ? 'bg-white/8' : 'hover:bg-white/5'}`}
                                    >
                                        <div
                                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                            style={{
                                                backgroundColor: config.dot,
                                                boxShadow: isActive ? `0 0 8px ${config.dot}` : 'none',
                                            }}
                                        />
                                        <span className={`${isActive ? 'text-[#E5E7EB]' : 'text-[#E5E7EB]/60'} font-medium`}>
                                            {config.label}
                                        </span>
                                        {isActive && (
                                            <span className="ml-auto text-[#E5E7EB]/30 text-[10px]">✓</span>
                                        )}
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
