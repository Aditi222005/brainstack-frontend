import { ChevronRight, Brain, Lightbulb, Network, Plus, Compass } from 'lucide-react';
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
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    height: '100%',
                    background: 'rgba(11,15,26,0.92)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderLeft: '0.5px solid var(--color-border)',
                    zIndex: 40,
                    transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                    width: 320,
                    boxShadow: '-20px 0 50px rgba(0,0,0,0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    transform: !isOpen ? 'translateX(100%)' : 'translateX(0)',
                }}
            >
                {/* Toggle button */}
                <button
                    onClick={togglePanel}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: -40,
                        transform: 'translateY(-50%)',
                        width: 40,
                        height: 88,
                        background: 'rgba(11,15,26,0.92)',
                        border: '0.5px solid var(--color-border)',
                        borderRight: 'none',
                        borderRadius: '12px 0 0 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--color-primary)',
                        zIndex: 50,
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(124,111,255,0.12)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(11,15,26,0.92)')}
                >
                    <ChevronRight
                        style={{
                            width: 20,
                            height: 20,
                            transition: 'transform 0.4s',
                            transform: !isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            color: !isOpen ? 'var(--color-secondary)' : 'var(--color-primary)',
                        }}
                    />
                </button>

                {/* Panel content */}
                <div
                    className="scrollbar-hide"
                    style={{
                        padding: 24,
                        overflowY: 'auto',
                        width: '100%',
                        height: '100%',
                        color: 'var(--color-text)',
                    }}
                >
                    {/* Header */}
                    <h2
                        style={{
                            fontFamily: "'Sora', sans-serif",
                            fontWeight: 800,
                            fontSize: 18,
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            borderBottom: '0.5px solid var(--color-border)',
                            paddingBottom: 16,
                            marginBottom: 24,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <Brain style={{ width: 20, height: 20, color: 'var(--color-primary)', WebkitTextFillColor: 'var(--color-primary)' }} />
                        AI Brain
                    </h2>

                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
                            <div style={{ position: 'relative' }}>
                                <Brain style={{ width: 44, height: 44, color: 'var(--color-primary)', animation: 'pulse 2s infinite' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(124,111,255,0.2)', filter: 'blur(12px)', borderRadius: '50%', animation: 'ping 1s infinite' }} />
                            </div>
                            <p
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: 11,
                                    fontWeight: 500,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: 'var(--color-muted)',
                                    animation: 'pulse 2s infinite',
                                }}
                            >
                                Synthesizing Neural Map...
                            </p>
                        </div>
                    ) : insights ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 24 }}>
                            {/* Cognitive Summary */}
                            <section>
                                <h3
                                    style={{
                                        fontFamily: "'Sora', sans-serif",
                                        fontWeight: 700,
                                        fontSize: 11,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.15em',
                                        color: 'var(--color-primary)',
                                        marginBottom: 12,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                    }}
                                >
                                    <SparklesIcon style={{ width: 12, height: 12 }} />
                                    Cognitive Summary
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {(Array.isArray(insights.summary)
                                        ? insights.summary
                                        : (insights.summary || '')
                                            .toString()
                                            .split('\n')
                                            .flatMap(line => line.split('•'))
                                    )
                                        .map(s => typeof s === 'string' ? s.trim() : '')
                                        .filter(Boolean)
                                        .map((point, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: 10,
                                                    background: 'rgba(124,111,255,0.06)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    padding: '10px 12px',
                                                    border: '0.5px solid rgba(124,111,255,0.12)',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        marginTop: 5,
                                                        flexShrink: 0,
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: '50%',
                                                        background: 'var(--color-primary)',
                                                        boxShadow: '0 0 6px rgba(124,111,255,0.8)',
                                                        display: 'inline-block',
                                                    }}
                                                />
                                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.6, margin: 0 }}>
                                                    {point}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </section>

                            {/* How to Explore */}
                            {insights.howToUseBoard && insights.howToUseBoard.length > 0 && (
                                <section>
                                    <h3
                                        style={{
                                            fontFamily: "'Sora', sans-serif",
                                            fontWeight: 700,
                                            fontSize: 11,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.15em',
                                            color: '#10b981',
                                            marginBottom: 12,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                        }}
                                    >
                                        <Compass style={{ width: 12, height: 12 }} />
                                        How to Explore
                                    </h3>
                                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', padding: 0, margin: 0 }}>
                                        {insights.howToUseBoard.map((step, idx) => (
                                            <li
                                                key={idx}
                                                style={{
                                                    display: 'flex',
                                                    gap: 10,
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    fontSize: 12,
                                                    color: 'var(--color-muted)',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    padding: '10px 12px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    border: '0.5px solid var(--color-border)',
                                                    alignItems: 'flex-start',
                                                }}
                                            >
                                                <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 11, color: '#10b981', flexShrink: 0 }}>0{idx + 1}</span>
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Suggested Connections */}
                            {insights.connections && insights.connections.length > 0 && (
                                <section>
                                    <h3
                                        style={{
                                            fontFamily: "'Sora', sans-serif",
                                            fontWeight: 700,
                                            fontSize: 11,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.15em',
                                            color: 'var(--color-secondary)',
                                            marginBottom: 12,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                        }}
                                    >
                                        <Network style={{ width: 12, height: 12 }} />
                                        Suggested Connections
                                    </h3>
                                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', padding: 0, margin: 0 }}>
                                        {insights.connections.map((conn, idx) => {
                                            const config = EDGE_TYPES[conn.type] || EDGE_TYPES.relates_to;
                                            return (
                                                <li
                                                    key={idx}
                                                    onClick={() => onAddConnection(conn.source, conn.target, conn.type)}
                                                    style={{
                                                        background: 'rgba(0,210,200,0.04)',
                                                        cursor: 'pointer',
                                                        borderRadius: 'var(--radius-sm)',
                                                        padding: '10px 12px',
                                                        border: `0.5px solid ${config.color}33`,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 4,
                                                        transition: 'background 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,210,200,0.04)')}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: config.color }}>
                                                            {conn.source} → {conn.target}
                                                        </span>
                                                        <Plus style={{ width: 12, height: 12, color: config.color, opacity: 0.5 }} />
                                                    </div>
                                                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'var(--color-muted)' }}>
                                                        {config.label}: {conn.label}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </section>
                            )}

                            {/* Optional Ideas */}
                            {insights.suggestedNodes && insights.suggestedNodes.length > 0 && (
                                <section>
                                    <h3
                                        style={{
                                            fontFamily: "'Sora', sans-serif",
                                            fontWeight: 700,
                                            fontSize: 11,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.15em',
                                            color: '#ec4899',
                                            marginBottom: 12,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                        }}
                                    >
                                        <Lightbulb style={{ width: 12, height: 12 }} />
                                        Optional Ideas
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {insights.suggestedNodes.map((node, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => onAddIdea({
                                                    title: node.title,
                                                    content: node.content,
                                                    color: node.color,
                                                    x: window.innerWidth / 2 - 100 + (Math.random() * 200 - 100),
                                                    y: window.innerHeight / 2 - 50 + (Math.random() * 200 - 100)
                                                })}
                                                style={{
                                                    background: 'rgba(236,72,153,0.05)',
                                                    cursor: 'pointer',
                                                    borderRadius: 'var(--radius-sm)',
                                                    padding: '10px 12px',
                                                    border: '0.5px solid rgba(236,72,153,0.12)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 4,
                                                    transition: 'background 0.2s, border-color 0.2s',
                                                }}
                                                onMouseEnter={(e) => {
                                                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(236,72,153,0.1)';
                                                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(236,72,153,0.3)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(236,72,153,0.05)';
                                                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(236,72,153,0.12)';
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: '#f9a8d4' }}>{node.title}</span>
                                                    <Plus style={{ width: 12, height: 12, color: '#ec4899', opacity: 0.5 }} />
                                                </div>
                                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'var(--color-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {node.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 12 }}>
                            <Brain style={{ width: 28, height: 28, color: 'var(--color-muted)', opacity: 0.3 }} />
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-muted)', textAlign: 'center', maxWidth: 180, lineHeight: 1.6 }}>
                                Click Summary in the toolbar to generate insights.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function SparklesIcon({ style }: { style?: React.CSSProperties }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
        </svg>
    );
}
