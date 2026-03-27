import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Info } from 'lucide-react';
import { EDGE_TYPES, EDGE_TYPE_LIST, NODE_COLORS, NodeColor } from './boardTheme';

const COLOR_LIST: NodeColor[] = ['blue', 'purple', 'green', 'yellow', 'red'];

export function LegendPanel() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed top-6 right-6 z-40">
            {/* Toggle button */}
            <button
                onClick={() => setOpen(!open)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
                    ${open
                        ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                        : 'bg-[#111827]/70 backdrop-blur-xl border border-indigo-500/15 text-[#E5E7EB]/40 hover:text-indigo-300 hover:border-indigo-500/30'
                    }`}
                title="Toggle Legend"
            >
                <Info className="w-4 h-4" />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="absolute right-0 top-12 bg-[#111827]/90 backdrop-blur-xl border border-indigo-500/15 rounded-xl p-4 shadow-[0_8px_40px_rgba(0,0,0,0.5)] w-56"
                    >
                        {/* Connection Types */}
                        <div className="text-[9px] uppercase tracking-widest text-[#E5E7EB]/25 font-semibold mb-2">
                            Connections
                        </div>
                        <div className="flex flex-col gap-1.5 mb-4">
                            {EDGE_TYPE_LIST.map((type) => {
                                const config = EDGE_TYPES[type];
                                return (
                                    <div key={type} className="flex items-center gap-2.5">
                                        <svg width="24" height="4" className="flex-shrink-0">
                                            <line
                                                x1="0" y1="2" x2="24" y2="2"
                                                stroke={config.color}
                                                strokeWidth={2}
                                                strokeDasharray={config.dashArray === '0' ? 'none' : config.dashArray}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className="text-[11px] text-[#E5E7EB]/60">{config.icon} {config.label}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Node Colors */}
                        <div className="text-[9px] uppercase tracking-widest text-[#E5E7EB]/25 font-semibold mb-2">
                            Node Status
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {COLOR_LIST.map((color) => {
                                const config = NODE_COLORS[color];
                                return (
                                    <div key={color} className="flex items-center gap-2.5">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: config.dot }}
                                        />
                                        <span className="text-[11px] text-[#E5E7EB]/60">{config.label}</span>
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
