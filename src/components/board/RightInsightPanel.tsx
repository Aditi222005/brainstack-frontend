import { ChevronRight, Brain, Lightbulb, Network, Plus } from 'lucide-react';

interface RightInsightPanelProps {
    isOpen: boolean;
    togglePanel: () => void;
}

export function RightInsightPanel({ isOpen, togglePanel }: RightInsightPanelProps) {
    return (
        <>
            <div
                className={`fixed top-0 right-0 h-full bg-[#0a0614]/80 backdrop-blur-2xl border-l border-purple-500/20 z-40 transition-transform duration-300 w-80 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col ${!isOpen ? 'translate-x-full' : 'translate-x-0'}`}
            >
                <button
                    onClick={togglePanel}
                    className="absolute top-1/2 -left-10 w-10 h-16 bg-[#0a0614]/90 border-l border-t border-b border-purple-500/30 rounded-l-xl flex items-center justify-center cursor-pointer transition-colors hover:bg-purple-900/40 text-purple-300 z-50 shadow-[-5px_0_15px_rgba(168,85,247,0.15)]"
                >
                    <ChevronRight className={`w-5 h-5 transition-transform ${!isOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className="p-6 overflow-y-auto w-full h-full text-white">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 border-b border-white/10 pb-4 mb-6 relative">
                        AI Insights
                        <div className="absolute -bottom-px left-0 w-1/3 h-px bg-gradient-to-r from-purple-500 to-transparent" />
                    </h2>

                    <div className="space-y-8">
                        <section>
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-purple-200 uppercase tracking-widest mb-4">
                                <Brain className="w-4 h-4" />
                                Board Summary
                            </h3>
                            <div className="bg-purple-500/10 rounded-lg p-4 text-sm text-gray-300 border border-purple-500/20 leading-relaxed shadow-inner">
                                3 key central ideas identified. The primary focus seems to be AI integration within a productivity ecosystem. Consider expanding on the scaling strategy.
                            </div>
                        </section>

                        <section>
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-200 uppercase tracking-widest mb-4">
                                <Network className="w-4 h-4" />
                                Suggested Connections
                            </h3>
                            <ul className="space-y-3">
                                {["User Flow → Database Schema", "AI Insights → Toolbar"].map((conn, idx) => (
                                    <li key={idx} className="bg-blue-900/20 hover:bg-blue-900/40 cursor-pointer rounded-lg p-3 text-sm text-gray-300 border border-blue-500/20 transition-colors flex justify-between items-center group">
                                        {conn}
                                        <Plus className="w-3 h-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-pink-200 uppercase tracking-widest mb-4">
                                <Lightbulb className="w-4 h-4" />
                                Smart Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['#AI', '#SaaS', '#Scale', '#Productivity'].map(tag => (
                                    <span key={tag} className="text-xs bg-pink-900/30 text-pink-300 px-3 py-1.5 rounded-full border border-pink-500/30 cursor-pointer hover:bg-pink-900/50 transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
