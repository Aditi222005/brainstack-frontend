import { ChevronRight, Brain, Lightbulb, Network, Plus, Compass } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Idea } from './IdeaCard';
import { NodeColor, EdgeType, EDGE_TYPES } from './boardTheme';

interface SuggestedNode {
    title: string;
    content: string;
    color: NodeColor;
}

interface ConnectionSuggestion {
    source: string;
    target: string;
    type: EdgeType;
    label: string;
}

interface InsightsData {
    summary: string;
    connections: ConnectionSuggestion[];
    suggestedNodes?: SuggestedNode[];
    howToUseBoard?: string[];
}

interface RightInsightPanelProps {
    isOpen: boolean;
    togglePanel: () => void;
    insights: InsightsData | null;
    isLoading: boolean;
    onAddIdea: (data: Partial<Idea>) => void;
    onAddConnection: (sourceTitle: string, targetTitle: string, type: EdgeType) => void;
}

export function RightInsightPanel({ isOpen, togglePanel, insights, isLoading, onAddIdea, onAddConnection }: RightInsightPanelProps) {
    return (
        <>
            <div
                className={`fixed top-0 right-0 h-full bg-[#0B0F19]/90 backdrop-blur-3xl border-l border-indigo-500/20 z-40 transition-transform duration-500 ease-out w-80 shadow-[-20px_0_50px_rgba(0,0,0,0.7)] flex flex-col ${!isOpen ? 'translate-x-full' : 'translate-x-0'}`}
            >
                <button
                    onClick={togglePanel}
                    className="absolute top-1/2 -left-10 w-10 h-24 bg-[#0B0F19]/90 border-l border-t border-b border-indigo-500/30 rounded-l-2xl flex items-center justify-center cursor-pointer transition-all hover:bg-indigo-900/40 text-indigo-400 z-50 shadow-[-10px_0_20px_rgba(99,102,241,0.2)] group"
                >
                    <ChevronRight className={`w-6 h-6 transition-transform duration-500 ${!isOpen ? 'rotate-180 text-cyan-400' : 'text-indigo-400 group-hover:translate-x-1'}`} />
                </button>

                <div className="p-6 overflow-y-auto w-full h-full text-[#E5E7EB] scrollbar-hide">
                    <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-300 via-cyan-300 to-purple-400 border-b border-white/5 pb-5 mb-8 flex items-center gap-3">
                        <Brain className="w-6 h-6 text-indigo-400" />
                        AI Brain
                    </h2>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-indigo-400">
                            <div className="relative mb-6">
                                <Brain className="w-12 h-12 animate-pulse" />
                                <div className="absolute inset-0 w-12 h-12 bg-indigo-500/20 blur-xl animate-ping rounded-full" />
                            </div>
                            <p className="text-xs font-bold animate-pulse tracking-[0.2em] uppercase text-indigo-300/80">Synthesizing Neural Map...</p>
                        </div>
                    ) : insights ? (
                        <div className="space-y-10 pb-10">
                            {/* Cognitive Summary Section */}
                            <section className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4 opacity-80">
                                    <SparklesIcon className="w-3.5 h-3.5" />
                                    Cognitive Summary
                                </h3>
                                <div className="space-y-2">
                                    {/* Normalise: split on newlines first, then on inline • separators */}
                                    {insights.summary
                                        .split('\n')
                                        .flatMap(line => line.split('•'))
                                        .map(s => s.trim())
                                        .filter(Boolean)
                                        .map((point, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/5 rounded-xl px-4 py-3 border border-indigo-500/15 shadow-sm"
                                                style={{ animationDelay: `${i * 60}ms` }}
                                            >
                                                {/* Glowing bullet dot */}
                                                <span className="mt-[5px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
                                                <p className="text-xs text-[#E5E7EB]/80 leading-relaxed">
                                                    {point}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </section>


                            {/* How to Explore Section */}
                            {insights.howToUseBoard && insights.howToUseBoard.length > 0 && (
                                <section className="animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
                                    <h3 className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4 opacity-80">
                                        <Compass className="w-3.5 h-3.5" />
                                        How to Explore
                                    </h3>
                                    <ul className="space-y-2">
                                        {insights.howToUseBoard.map((step, idx) => (
                                            <li key={idx} className="flex gap-3 text-xs text-[#E5E7EB]/60 bg-white/5 p-3 rounded-xl border border-white/5 items-start">
                                                <span className="text-emerald-400 font-mono font-bold">0{idx + 1}</span>
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Suggested Connections Section */}
                            {insights.connections && insights.connections.length > 0 && (
                                <section className="animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                                    <h3 className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em] mb-4 opacity-80">
                                        <Network className="w-3.5 h-3.5" />
                                        Suggested Connections
                                    </h3>
                                    <ul className="space-y-2">
                                        {insights.connections.map((conn, idx) => {
                                            const config = EDGE_TYPES[conn.type] || EDGE_TYPES.relates_to;
                                            return (
                                                <li 
                                                    key={idx} 
                                                    onClick={() => onAddConnection(conn.source, conn.target, conn.type)}
                                                    className="bg-cyan-500/5 hover:bg-white/5 cursor-pointer rounded-xl p-3 border transition-all flex flex-col gap-1 group active:scale-95 duration-150"
                                                    style={{ borderColor: `${config.color}33` }} // 0x33 = 20% alpha
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold" style={{ color: config.color }}>
                                                            {conn.source} → {conn.target}
                                                        </span>
                                                        <Plus className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: config.color }} />
                                                    </div>
                                                    <span className="text-[10px] text-[#E5E7EB]/50">
                                                        {config.label}: {conn.label}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </section>
                            )}

                            {/* Optional Ideas Section */}
                            {insights.suggestedNodes && insights.suggestedNodes.length > 0 && (
                                <section className="animate-in fade-in slide-in-from-right-4 duration-700 delay-500">
                                    <h3 className="flex items-center gap-2 text-[10px] font-bold text-pink-400 uppercase tracking-[0.2em] mb-4 opacity-80">
                                        <Lightbulb className="w-3.5 h-3.5" />
                                        Optional Ideas
                                    </h3>
                                    <div className="space-y-3">
                                        {insights.suggestedNodes.map((node, idx) => (
                                            <div 
                                                key={idx} 
                                                onClick={() => onAddIdea({
                                                    title: node.title,
                                                    content: node.content,
                                                    color: node.color,
                                                    // Place near center with slight random offset
                                                    x: window.innerWidth / 2 - 100 + (Math.random() * 200 - 100),
                                                    y: window.innerHeight / 2 - 50 + (Math.random() * 200 - 100)
                                                })}
                                                className="bg-pink-500/5 hover:bg-pink-500/15 rounded-xl p-3 border border-pink-500/10 transition-all flex flex-col gap-1 group hover:border-pink-500/30 cursor-pointer active:scale-95 duration-150"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-pink-300">{node.title}</span>
                                                    <Plus className="w-3.5 h-3.5 text-pink-400/50 group-hover:text-pink-400 transition-colors" />
                                                </div>
                                                <p className="text-[10px] text-[#E5E7EB]/50 line-clamp-2">{node.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-[#E5E7EB]/40 animate-pulse">
                            <Brain className="w-8 h-8 mb-4 opacity-20" />
                            <p className="text-[10px] uppercase tracking-widest text-center px-10">Click Summary in the toolbar to generate insights.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function SparklesIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
        </svg>
    );
}

