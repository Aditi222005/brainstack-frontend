import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Link as LinkIcon, DownloadCloud, Layers } from 'lucide-react';
import { useState } from 'react';

export function FloatingActions({ onAddIdea }: { onAddIdea?: () => void }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-4">
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className="flex flex-col gap-3 mb-2"
                    >
                        <button onClick={onAddIdea} className="flex items-center gap-3 bg-[#111827] hover:bg-indigo-900/40 border border-indigo-500/20 text-white px-4 py-2.5 rounded-full shadow-lg transition-colors group">
                            <span className="text-sm font-medium">Add Idea</span>
                            <div className="bg-indigo-500/15 p-1.5 rounded-full group-hover:bg-indigo-500/30 transition-colors">
                                <Plus className="w-4 h-4 text-indigo-300" />
                            </div>
                        </button>
                        <button className="flex items-center gap-3 bg-[#111827] hover:bg-cyan-900/30 border border-cyan-500/20 text-white px-4 py-2.5 rounded-full shadow-lg transition-colors group">
                            <span className="text-sm font-medium">Add Group</span>
                            <div className="bg-cyan-500/15 p-1.5 rounded-full group-hover:bg-cyan-500/30 transition-colors">
                                <Layers className="w-4 h-4 text-cyan-300" />
                            </div>
                        </button>
                        <button className="flex items-center gap-3 bg-[#111827] hover:bg-pink-900/30 border border-pink-500/20 text-white px-4 py-2.5 rounded-full shadow-lg transition-colors group">
                            <span className="text-sm font-medium">Import Notes</span>
                            <div className="bg-pink-500/15 p-1.5 rounded-full group-hover:bg-pink-500/30 transition-colors">
                                <DownloadCloud className="w-4 h-4 text-pink-300" />
                            </div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setExpanded(!expanded)}
                className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_35px_rgba(99,102,241,0.8)] transition-all hover:scale-105"
            >
                <motion.div
                    animate={{ rotate: expanded ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <Plus className="w-8 h-8 text-white" />
                </motion.div>
            </button>
        </div>
    );
}
