import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { IdeaCard, Idea } from './IdeaCard';
import { EdgeLine, DraftEdgeLine, EdgeData } from './EdgeLine';
import { EdgeTypeSelector } from './EdgeTypeSelector';
import { EdgeType, NodeColor, NODE_COLORS } from './boardTheme';
import { suggestConnectionType } from './connectionSuggester';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Maximize, Lock, Unlock } from 'lucide-react';

export interface Cluster {
    id: string;
    title: string;
    nodeIds: string[];
    color: NodeColor;
}

interface BoardCanvasProps {
    ideas: Idea[];
    edges: EdgeData[];
    onUpdateIdea?: (id: string, updates: Partial<Idea>) => void;
    onCreateEdge?: (source: string, target: string, type: EdgeType) => void;
    onDeleteEdge?: (edgeId: string) => void;
    onDeleteIdea?: (id: string) => void;
}

const CARD_WIDTH = 288;
const CARD_HEIGHT = 180;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const SCROLL_THRESHOLD = 80;
const SCROLL_SPEED = 12;

export function BoardCanvas({ ideas, edges, onUpdateIdea, onCreateEdge, onDeleteEdge, onDeleteIdea }: BoardCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const containerRectRef = useRef<DOMRect | null>(null);
    const rafRef = useRef<number | null>(null);

    const [viewTransform, setViewTransform] = useState(() => {
        try {
            const saved = localStorage.getItem('brainstack-canvas-transform');
            if (saved) return JSON.parse(saved);
        } catch (e) { console.error('Failed to restore canvas transform:', e); }
        return { x: 0, y: 0, zoom: 0.85 };
    });

    useEffect(() => {
        try { localStorage.setItem('brainstack-canvas-transform', JSON.stringify(viewTransform)); }
        catch (e) { console.error('Failed to save canvas transform:', e); }
    }, [viewTransform]);

    const [isPanning, setIsPanning] = useState(false);
    const [isLocked, setIsLocked] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
    const [connectingFromPos, setConnectingFromPos] = useState<{ x: number; y: number } | null>(null);
    const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [pendingConnection, setPendingConnection] = useState<{ source: string; target: string } | null>(null);
    const [selectorPos, setSelectorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [connectionSuggestion, setConnectionSuggestion] = useState<{ type: EdgeType; reason: string } | null>(null);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const connectionHandledRef = useRef(false);

    const ideasRef = useRef(ideas);
    useEffect(() => { ideasRef.current = ideas; }, [ideas]);
    const mousePosRef = useRef(mousePos);
    useEffect(() => { mousePosRef.current = mousePos; }, [mousePos]);

    const handleNodeClick = useCallback((id: string, shiftKey: boolean) => {
        if (shiftKey) {
            setSelectedNodeIds(prev => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id); else next.add(id);
                return next;
            });
        } else {
            setSelectedNodeIds(new Set([id]));
        }
    }, []);

    const handleConnectionEnd = useCallback((id: string) => {
        connectionHandledRef.current = true;
        if (connectingFromId && connectingFromId !== id) {
            const src = ideasRef.current.find(i => i.id === connectingFromId);
            const tgt = ideasRef.current.find(i => i.id === id);
            setConnectionSuggestion(src && tgt ? suggestConnectionType(src, tgt) : null);
            setPendingConnection({ source: connectingFromId, target: id });
            setSelectorPos({ x: mousePosRef.current.x, y: mousePosRef.current.y });
        }
        setIsConnecting(false);
        setConnectingFromId(null);
        setConnectingFromPos(null);
    }, [connectingFromId]);

    const connectedNodeIds = useMemo(() => {
        if (!hoveredNodeId) return new Set<string>();
        const res = new Set<string>();
        edges.forEach(e => {
            if (e.source === hoveredNodeId) res.add(e.target);
            if (e.target === hoveredNodeId) res.add(e.source);
        });
        return res;
    }, [hoveredNodeId, edges]);

    const handleZoom = useCallback((delta: number, centerX: number, centerY: number) => {
        if (isLocked || rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
            setViewTransform(prev => {
                const nextZoom = Math.min(Math.max(prev.zoom + delta, MIN_ZOOM), MAX_ZOOM);
                const zoomFactor = nextZoom / prev.zoom;
                if (zoomFactor === 1) return prev;
                return { zoom: nextZoom, x: prev.x + (centerX - prev.x) * (1 - zoomFactor), y: prev.y + (centerY - prev.y) * (1 - zoomFactor) };
            });
            rafRef.current = null;
        });
    }, [isLocked]);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        if (isLocked) return;
        if (e.ctrlKey) {
            handleZoom(-e.deltaY * 0.0025, e.clientX, e.clientY);
        } else {
            if (rafRef.current) return;
            rafRef.current = requestAnimationFrame(() => {
                setViewTransform(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
                rafRef.current = null;
            });
        }
    }, [handleZoom, isLocked]);

    const startPanning = useCallback((e: React.PointerEvent) => {
        if (isLocked) return;
        if (e.button === 1 || (e.button === 0 && (e.altKey || e.target === e.currentTarget))) {
            setIsPanning(true);
            const startX = e.clientX, startY = e.clientY;
            const initialX = viewTransform.x, initialY = viewTransform.y;
            const onMove = (mv: PointerEvent) => {
                if (rafRef.current) return;
                rafRef.current = requestAnimationFrame(() => {
                    setViewTransform(p => ({ ...p, x: initialX + (mv.clientX - startX), y: initialY + (mv.clientY - startY) }));
                    rafRef.current = null;
                });
            };
            const onEnd = () => { setIsPanning(false); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onEnd); };
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onEnd);
        }
    }, [viewTransform.x, viewTransform.y, isLocked]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isConnecting || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            let dx = 0, dy = 0;
            if (mousePos.x < rect.left + SCROLL_THRESHOLD) dx = SCROLL_SPEED;
            else if (mousePos.x > rect.right - SCROLL_THRESHOLD) dx = -SCROLL_SPEED;
            if (mousePos.y < rect.top + SCROLL_THRESHOLD) dy = SCROLL_SPEED;
            else if (mousePos.y > rect.bottom - SCROLL_THRESHOLD) dy = -SCROLL_SPEED;
            if (dx !== 0 || dy !== 0) setViewTransform(p => ({ ...p, x: p.x + dx, y: p.y + dy }));
        }, 16);
        return () => clearInterval(interval);
    }, [isConnecting, mousePos]);

    const handleConnectionStart = useCallback((nodeId: string, side: string, e: React.PointerEvent) => {
        const idea = ideasRef.current.find(i => i.id === nodeId);
        if (!idea) return;
        if (containerRef.current) containerRectRef.current = containerRef.current.getBoundingClientRect();
        connectionHandledRef.current = false;
        let hX = idea.x, hY = idea.y;
        if (side === 'right') { hX += CARD_WIDTH; hY += CARD_HEIGHT / 2; }
        else if (side === 'left') { hY += CARD_HEIGHT / 2; }
        else if (side === 'top') { hX += CARD_WIDTH / 2; }
        else if (side === 'bottom') { hX += CARD_WIDTH / 2; hY += CARD_HEIGHT; }
        setIsConnecting(true);
        setConnectingFromId(nodeId);
        setConnectingFromPos({ x: hX, y: hY });
        setMousePos({ x: e.clientX, y: e.clientY });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { setIsConnecting(false); setPendingConnection(null); }
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeIds.size > 0 && onDeleteIdea) {
                if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
                selectedNodeIds.forEach(id => onDeleteIdea(id));
                setSelectedNodeIds(new Set());
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedNodeIds, onDeleteIdea]);

    useEffect(() => {
        if (!isConnecting) return;
        let trackingRaf: number | null = null;
        const handlePointerMove = (e: PointerEvent) => {
            if (trackingRaf) return;
            trackingRaf = requestAnimationFrame(() => { setMousePos({ x: e.clientX, y: e.clientY }); trackingRaf = null; });
        };
        const handlePointerUp = () => {
            if (!connectionHandledRef.current) { setIsConnecting(false); setConnectingFromId(null); }
            connectionHandledRef.current = false;
        };
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        return () => {
            if (trackingRaf) cancelAnimationFrame(trackingRaf);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isConnecting]);

    const resetView = () => setViewTransform({ x: 0, y: 0, zoom: 0.85 });

    const handleDoubleClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) setIsLocked(!isLocked);
    };

    /* ── control button shared styles ── */
    const ctrlBtn: React.CSSProperties = {
        background: 'rgba(11,15,26,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 10,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'border-color 0.2s, color 0.2s',
        color: 'rgba(232,234,240,0.55)',
    };

    return (
        <div
            ref={containerRef}
            style={{ background: 'var(--color-bg)' }}
            className={`absolute inset-0 overflow-hidden ${isPanning ? 'cursor-grabbing' : (isLocked ? 'cursor-default' : 'cursor-grab')}`}
            onWheel={handleWheel}
            onPointerDown={startPanning}
            onDoubleClick={handleDoubleClick}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedNodeIds(new Set()); }}
        >
            {/* ── Background dot grid ── */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(124,111,255,0.18) 1px, transparent 0)',
                    backgroundSize: '36px 36px',
                    transform: `translate3d(${viewTransform.x}px,${viewTransform.y}px,0) scale(${viewTransform.zoom})`,
                    transformOrigin: 'top left',
                    willChange: 'transform',
                    opacity: 0.6,
                }}
            />

            {/* ── Canvas lock indicator ── */}
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
                <AnimatePresence>
                    {isLocked && (
                        <motion.div
                            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                            style={{
                                background: 'rgba(11,15,26,0.88)',
                                backdropFilter: 'blur(12px)',
                                border: '0.5px solid rgba(255,255,255,0.08)',
                                borderRadius: 999,
                                padding: '6px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            }}
                        >
                            <Lock style={{ width: 12, height: 12, color: 'var(--color-primary)' }} />
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(232,234,240,0.55)' }}>
                                Canvas Locked — double-click to unlock
                            </span>
                        </motion.div>
                    )}
                    {!isLocked && (
                        <motion.div
                            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                            style={{
                                background: 'rgba(124,111,255,0.10)',
                                backdropFilter: 'blur(12px)',
                                border: '0.5px solid rgba(124,111,255,0.35)',
                                borderRadius: 999,
                                padding: '6px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            }}
                        >
                            <Unlock style={{ width: 12, height: 12, color: 'var(--color-primary)' }} />
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                                Canvas Unlocked — drag to pan
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Multi-select cluster banner ── */}
            <AnimatePresence>
                {selectedNodeIds.size >= 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 10, x: '-50%' }}
                        style={{
                            position: 'fixed', bottom: 96, left: '50%', zIndex: 100,
                            background: 'var(--color-primary)',
                            borderRadius: 999,
                            padding: '10px 24px',
                            display: 'flex', alignItems: 'center', gap: 16,
                            boxShadow: '0 8px 24px rgba(124,111,255,0.4)',
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 500,
                            color: '#fff',
                            fontSize: 14,
                        }}
                    >
                        <span>{selectedNodeIds.size} nodes selected</span>
                        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.25)' }} />
                        <button
                            onClick={() => setClusters(p => [...p, { id: `cl-${Date.now()}`, title: `Cluster ${clusters.length + 1}`, nodeIds: Array.from(selectedNodeIds), color: 'purple' }])}
                            style={{ background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', padding: '4px 12px', borderRadius: 999, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 12, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                        >
                            Create Group
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <EdgeTypeSelector
                visible={!!pendingConnection}
                position={selectorPos}
                suggestion={connectionSuggestion}
                onSelect={(type) => {
                    if (pendingConnection) onCreateEdge?.(pendingConnection.source, pendingConnection.target, type);
                    setPendingConnection(null); setConnectionSuggestion(null);
                }}
                onCancel={() => { setPendingConnection(null); setConnectionSuggestion(null); }}
            />

            {/* ── Zoom / Lock controls ── */}
            <div style={{ position: 'fixed', bottom: 112, right: 32, zIndex: 30, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={resetView} style={ctrlBtn} title="Reset View"
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,234,240,0.55)')}
                >
                    <Maximize style={{ width: 18, height: 18 }} />
                </button>
                <button
                    onClick={() => setIsLocked(!isLocked)}
                    title={isLocked ? 'Unlock Canvas' : 'Lock Canvas'}
                    style={{ ...ctrlBtn, borderColor: isLocked ? 'rgba(124,111,255,0.4)' : 'rgba(255,255,255,0.08)', color: isLocked ? 'var(--color-primary)' : 'rgba(232,234,240,0.55)' }}
                >
                    {isLocked ? <Lock style={{ width: 18, height: 18 }} /> : <Unlock style={{ width: 18, height: 18 }} />}
                </button>
                <div style={{ ...ctrlBtn, flexDirection: 'column', padding: 4, gap: 0, borderRadius: 14 }}>
                    <button onClick={() => !isLocked && handleZoom(0.15, window.innerWidth / 2, window.innerHeight / 2)}
                        style={{ background: 'none', border: 'none', cursor: isLocked ? 'not-allowed' : 'pointer', padding: 8, color: isLocked ? 'rgba(232,234,240,0.2)' : 'rgba(232,234,240,0.55)', borderRadius: 10, transition: 'color 0.2s' }}
                        onMouseEnter={e => { if (!isLocked) (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-primary)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = isLocked ? 'rgba(232,234,240,0.2)' : 'rgba(232,234,240,0.55)'; }}
                    ><Plus style={{ width: 16, height: 16 }} /></button>
                    <div style={{ height: 1, width: 24, background: 'rgba(255,255,255,0.06)', margin: '0 auto' }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, color: 'rgba(124,111,255,0.7)', padding: '4px 0', textAlign: 'center' }}>{Math.round(viewTransform.zoom * 100)}%</span>
                    <div style={{ height: 1, width: 24, background: 'rgba(255,255,255,0.06)', margin: '0 auto' }} />
                    <button onClick={() => !isLocked && handleZoom(-0.15, window.innerWidth / 2, window.innerHeight / 2)}
                        style={{ background: 'none', border: 'none', cursor: isLocked ? 'not-allowed' : 'pointer', padding: 8, color: isLocked ? 'rgba(232,234,240,0.2)' : 'rgba(232,234,240,0.55)', borderRadius: 10, transition: 'color 0.2s' }}
                        onMouseEnter={e => { if (!isLocked) (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-primary)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = isLocked ? 'rgba(232,234,240,0.2)' : 'rgba(232,234,240,0.55)'; }}
                    ><Minus style={{ width: 16, height: 16 }} /></button>
                </div>
            </div>

            {/* ── Infinite board layer ── */}
            <div style={{ transform: `translate3d(${viewTransform.x}px,${viewTransform.y}px,0) scale(${viewTransform.zoom})`, transformOrigin: 'top left', willChange: 'transform' }} className="absolute inset-0 pointer-events-none">
                <div className="pointer-events-auto w-full h-full relative">
                    {/* Cluster backgrounds */}
                    <div className="absolute inset-0 z-[2] pointer-events-none">
                        {clusters.map(cluster => {
                            const gr = ideas.filter(i => cluster.nodeIds.includes(i.id));
                            if (gr.length === 0) return null;
                            const minX = Math.min(...gr.map(i => i.x)) - 32, minY = Math.min(...gr.map(i => i.y)) - 56;
                            const maxX = Math.max(...gr.map(i => i.x + CARD_WIDTH)) + 32, maxY = Math.max(...gr.map(i => i.y + CARD_HEIGHT)) + 32;
                            const cf = NODE_COLORS[cluster.color];
                            return (
                                <div key={cluster.id} className={`absolute rounded-3xl border pointer-events-auto ${cf.bg} ${cf.border}`}
                                    style={{ left: minX, top: minY, width: maxX - minX, height: maxY - minY, borderStyle: 'dashed', opacity: 0.65 }}>
                                    <div style={{ position: 'absolute', top: 10, left: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${cf.text}`} style={{ background: 'rgba(0,0,0,0.35)', padding: '2px 10px', borderRadius: 999, border: '0.5px solid rgba(255,255,255,0.06)' }}>{cluster.title}</span>
                                        <button onClick={() => setClusters(clusters.filter(c => c.id !== cluster.id))} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(239,68,68,0.6)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Ungroup</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Edges */}
                    <svg className="absolute inset-0 w-full h-full z-[5] pointer-events-none" style={{ overflow: 'visible' }}>
                        <g style={{ pointerEvents: 'auto' }}>
                            {edges.map(edge => {
                                const s = ideas.find(i => i.id === edge.source), t = ideas.find(i => i.id === edge.target);
                                if (!s || !t) return null;
                                return <EdgeLine key={edge.id} edge={edge} sourcePos={{ x: s.x, y: s.y }} targetPos={{ x: t.x, y: t.y }} onDelete={(id) => edges.filter(e => e.id !== id)} dimmed={!!(hoveredNodeId && hoveredNodeId !== edge.source && hoveredNodeId !== edge.target)} />;
                            })}
                        </g>
                        {isConnecting && connectingFromPos && <DraftEdgeLine fromPos={connectingFromPos} toPos={{ x: (mousePos.x - viewTransform.x) / viewTransform.zoom, y: (mousePos.y - viewTransform.y) / viewTransform.zoom }} />}
                    </svg>
                    {/* Cards */}
                    <div className="relative w-full h-full z-10 p-20">
                        {ideas.map((idea) => {
                            const hv = hoveredNodeId === idea.id, cn = connectedNodeIds.has(idea.id), sl = selectedNodeIds.has(idea.id);
                            return (
                                <div key={idea.id} onMouseEnter={() => setHoveredNodeId(idea.id)} onMouseLeave={() => setHoveredNodeId(null)} onClick={(e) => { e.stopPropagation(); handleNodeClick(idea.id, e.shiftKey); }} className={sl ? 'z-[60]' : ''}>
                                    <IdeaCard idea={idea} onUpdate={onUpdateIdea} onDelete={onDeleteIdea} onConnectionStart={handleConnectionStart} onConnectionEnd={handleConnectionEnd} isConnecting={isConnecting} connectingFromId={connectingFromId} highlighted={hv || cn || sl} dimmed={!!(hoveredNodeId && !hv && !cn) && !sl} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
