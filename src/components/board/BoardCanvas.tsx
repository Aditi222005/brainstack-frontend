import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { IdeaCard, Idea } from './IdeaCard';
import { EdgeLine, DraftEdgeLine, EdgeData } from './EdgeLine';
import { EdgeTypeSelector } from './EdgeTypeSelector';
import { EdgeType, NodeColor, NODE_COLORS } from './boardTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Maximize, Lock, Unlock, MousePointer2 } from 'lucide-react';

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
}

const CARD_WIDTH = 288;
const CARD_HEIGHT = 180;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const SCROLL_THRESHOLD = 80;
const SCROLL_SPEED = 12;

export function BoardCanvas({
    ideas,
    edges,
    onUpdateIdea,
    onCreateEdge,
    onDeleteEdge,
}: BoardCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const containerRectRef = useRef<DOMRect | null>(null);
    const rafRef = useRef<number | null>(null);

    // Zoom & Pan State
    const [viewTransform, setViewTransform] = useState(() => {
        try {
            const saved = localStorage.getItem('brainstack-canvas-transform');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to restore canvas transform:', e);
        }
        return { x: 0, y: 0, zoom: 0.85 };
    });
    
    useEffect(() => {
        try {
            localStorage.setItem('brainstack-canvas-transform', JSON.stringify(viewTransform));
        } catch (e) {
            console.error('Failed to save canvas transform:', e);
        }
    }, [viewTransform]);

    const [isPanning, setIsPanning] = useState(false);
    const [isLocked, setIsLocked] = useState(true);

    // Interaction state
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
    const [connectingFromPos, setConnectingFromPos] = useState<{ x: number; y: number } | null>(null);
    const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [pendingConnection, setPendingConnection] = useState<{ source: string; target: string } | null>(null);
    const [selectorPos, setSelectorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
    const [clusters, setClusters] = useState<Cluster[]>([]);

    const connectionHandledRef = useRef(false);

    // Refs for stable callbacks
    const ideasRef = useRef(ideas);
    useEffect(() => { ideasRef.current = ideas; }, [ideas]);
    const mousePosRef = useRef(mousePos);
    useEffect(() => { mousePosRef.current = mousePos; }, [mousePos]);

    const handleNodeClick = useCallback((id: string, shiftKey: boolean) => {
        if (shiftKey) {
            setSelectedNodeIds(prev => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            });
        } else {
            setSelectedNodeIds(new Set([id]));
        }
    }, []);

    const handleConnectionEnd = useCallback((id: string) => {
        connectionHandledRef.current = true;
        if (connectingFromId && connectingFromId !== id) {
            setPendingConnection({ source: connectingFromId, target: id });
            setSelectorPos({ x: mousePosRef.current.x, y: mousePosRef.current.y });
        }
        setIsConnecting(false);
        setConnectingFromId(null);
        setConnectingFromPos(null);
    }, [connectingFromId]);

    // Memoized connectivity
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
        if (isLocked) return;
        if (rafRef.current) return;

        rafRef.current = requestAnimationFrame(() => {
            setViewTransform(prev => {
                const nextZoom = Math.min(Math.max(prev.zoom + delta, MIN_ZOOM), MAX_ZOOM);
                const zoomFactor = nextZoom / prev.zoom;
                if (zoomFactor === 1) return prev;

                return {
                    zoom: nextZoom,
                    x: prev.x + (centerX - prev.x) * (1 - zoomFactor),
                    y: prev.y + (centerY - prev.y) * (1 - zoomFactor),
                };
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
                setViewTransform(prev => ({
                    ...prev,
                    x: prev.x - e.deltaX,
                    y: prev.y - e.deltaY,
                }));
                rafRef.current = null;
            });
        }
    }, [handleZoom, isLocked]);

    const startPanning = useCallback((e: React.PointerEvent) => {
        if (isLocked) return;

        // Allow panning with: Middle mouse (1), Alt+Left (0+alt), or Normal Left Click on BACKGROUND (0 + target is canvas)
        if (e.button === 1 || (e.button === 0 && (e.altKey || e.target === e.currentTarget))) {
            setIsPanning(true);
            const startX = e.clientX;
            const startY = e.clientY;
            const initialX = viewTransform.x;
            const initialY = viewTransform.y;

            const onMove = (mv: PointerEvent) => {
                if (rafRef.current) return;
                rafRef.current = requestAnimationFrame(() => {
                    setViewTransform(p => ({
                        ...p,
                        x: initialX + (mv.clientX - startX),
                        y: initialY + (mv.clientY - startY)
                    }));
                    rafRef.current = null;
                });
            };
            const onEnd = () => {
                setIsPanning(false);
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onEnd);
            };
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onEnd);
        }
    }, [viewTransform.x, viewTransform.y, isLocked]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isConnecting) return;
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            let dx = 0, dy = 0;
            const threshold = SCROLL_THRESHOLD;
            if (mousePos.x < rect.left + threshold) dx = SCROLL_SPEED;
            else if (mousePos.x > rect.right - threshold) dx = -SCROLL_SPEED;
            if (mousePos.y < rect.top + threshold) dy = SCROLL_SPEED;
            else if (mousePos.y > rect.bottom - threshold) dy = -SCROLL_SPEED;
            if (dx !== 0 || dy !== 0) { setViewTransform(p => ({ ...p, x: p.x + dx, y: p.y + dy })); }
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
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!isConnecting) return;

        let trackingRaf: number | null = null;
        const handlePointerMove = (e: PointerEvent) => {
            if (trackingRaf) return;
            trackingRaf = requestAnimationFrame(() => {
                setMousePos({ x: e.clientX, y: e.clientY });
                trackingRaf = null;
            });
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
        // Only trigger lock toggle on DOUBLE click of the main canvas element (empty space)
        if (e.target === e.currentTarget) {
            setIsLocked(!isLocked);
        }
    };

    return (
        <div ref={containerRef} className={`absolute inset-0 bg-background overflow-hidden ${isPanning ? 'cursor-grabbing' : (isLocked ? 'cursor-default' : 'cursor-grab')}`} onWheel={handleWheel} onPointerDown={startPanning} onDoubleClick={handleDoubleClick} onClick={(e) => { if (e.target === e.currentTarget) setSelectedNodeIds(new Set()); }}>
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)', backgroundSize: `40px 40px`, transform: `translate3d(${viewTransform.x}px, ${viewTransform.y}px, 0) scale(${viewTransform.zoom})`, transformOrigin: 'top left', willChange: 'transform' }} />

            {/* Lock Indicator Floating */}
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
                <AnimatePresence>
                    {isLocked && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-card/80 backdrop-blur-xl border border-border px-4 py-1.5 rounded-full flex items-center gap-2 text-muted-foreground text-[10px] uppercase font-bold tracking-[0.2em] shadow-2xl">
                            <Lock className="w-3 h-3 text-primary" />
                            Canvas Locked. Double-click on background to unlock.
                        </motion.div>
                    )}
                    {!isLocked && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-primary/20 backdrop-blur-xl border border-primary/50 px-4 py-1.5 rounded-full flex items-center gap-2 text-primary text-[10px] uppercase font-bold tracking-[0.2em] shadow-2xl">
                            <Unlock className="w-3 h-3" />
                            Canvas Unlocked. Drag background to pan.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {selectedNodeIds.size >= 2 && (
                    <motion.div initial={{ opacity: 0, y: 10, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 10, x: '-50%' }} className="fixed bottom-24 left-1/2 z-[100] bg-primary px-6 py-3 rounded-full flex items-center gap-4 text-primary-foreground shadow-2xl font-bold border border-primary/20">
                        <span>{selectedNodeIds.size} nodes selected</span>
                        <div className="w-px h-4 bg-primary-foreground/30" />
                        <button onClick={() => setClusters(p => [...p, { id: `cl-${Date.now()}`, title: `Cluster ${clusters.length + 1}`, nodeIds: Array.from(selectedNodeIds), color: 'purple' }])} className="hover:bg-white/10 px-3 py-1 rounded transition-colors uppercase tracking-widest text-xs">CREATE GROUP</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <EdgeTypeSelector visible={!!pendingConnection} position={selectorPos} onSelect={(type) => { if (pendingConnection) onCreateEdge?.(pendingConnection.source, pendingConnection.target, type); setPendingConnection(null); }} onCancel={() => setPendingConnection(null)} />

            {/* Controls */}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2">
                <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-1 shadow-2xl flex flex-col items-center">
                    <button onClick={() => !isLocked && handleZoom(0.15, window.innerWidth / 2, window.innerHeight / 2)} className={`p-2.5 rounded-xl transition-colors ${isLocked ? 'text-muted-foreground/20 cursor-not-allowed' : 'hover:bg-primary/10 text-muted-foreground hover:text-primary'}`}><Plus className="w-5 h-5" /></button>
                    <div className="h-px w-6 bg-border/50" />
                    <span className="text-[10px] font-bold text-primary/60 py-1">{Math.round(viewTransform.zoom * 100)}%</span>
                    <div className="h-px w-6 bg-border/50" />
                    <button onClick={() => !isLocked && handleZoom(-0.15, window.innerWidth / 2, window.innerHeight / 2)} className={`p-2.5 rounded-xl transition-colors ${isLocked ? 'text-muted-foreground/20 cursor-not-allowed' : 'hover:bg-primary/10 text-muted-foreground hover:text-primary'}`}><Minus className="w-5 h-5" /></button>
                </div>
                <button onClick={() => setIsLocked(!isLocked)} className={`bg-card/80 backdrop-blur-xl border border-border rounded-xl p-3 shadow-2xl transition-all flex items-center justify-center ${isLocked ? 'text-primary border-primary/50' : 'text-muted-foreground hover:text-primary'}`} title={isLocked ? "Unlock Canvas" : "Lock Canvas"}>
                    {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                </button>
                <button onClick={resetView} className="bg-card/80 backdrop-blur-xl border border-border rounded-xl p-3 shadow-2xl text-muted-foreground hover:text-primary transition-colors flex items-center justify-center" title="Reset View"><Maximize className="w-5 h-5" /></button>
            </div>

            {/* Infinite Board Layer */}
            <div style={{ transform: `translate3d(${viewTransform.x}px, ${viewTransform.y}px, 0) scale(${viewTransform.zoom})`, transformOrigin: 'top left', willChange: 'transform' }} className="absolute inset-0 pointer-events-none">
                <div className="pointer-events-auto w-full h-full relative">
                    <div className="absolute inset-0 z-[2] pointer-events-none">
                        {clusters.map(cluster => {
                            const gr = ideas.filter(i => cluster.nodeIds.includes(i.id));
                            if (gr.length === 0) return null;
                            const minX = Math.min(...gr.map(i => i.x)) - 32, minY = Math.min(...gr.map(i => i.y)) - 60, maxX = Math.max(...gr.map(i => i.x + CARD_WIDTH)) + 32, maxY = Math.max(...gr.map(i => i.y + CARD_HEIGHT)) + 32;
                            const cf = NODE_COLORS[cluster.color];
                            return <div key={cluster.id} style={{ left: minX, top: minY, width: maxX - minX, height: maxY - minY }} className={`absolute rounded-3xl border-2 pointer-events-auto ${cf.bg} ${cf.border} border-dashed opacity-60`}><div className="absolute top-2 left-6 flex items-center gap-4 text-white"><span className={`text-[10px] font-bold uppercase tracking-widest ${cf.text} bg-black/40 px-3 py-1 rounded-full border border-white/5`}>{cluster.title}</span><button onClick={() => setClusters(clusters.filter(c => c.id !== cluster.id))} className="text-[#E5E7EB]/20 hover:text-red-400 transition-colors text-[10px] uppercase font-bold tracking-tighter cursor-pointer">UNGROUP</button></div></div>;
                        })}
                    </div>
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
                    <div className="relative w-full h-full z-10 p-20">
                        {ideas.map((idea) => {
                            const hv = hoveredNodeId === idea.id, cn = connectedNodeIds.has(idea.id), sl = selectedNodeIds.has(idea.id);
                            return <div key={idea.id} onMouseEnter={() => setHoveredNodeId(idea.id)} onMouseLeave={() => setHoveredNodeId(null)} onClick={(e) => { e.stopPropagation(); handleNodeClick(idea.id, e.shiftKey); }} className={`${sl ? 'z-[60]' : ''}`}><IdeaCard idea={idea} onUpdate={onUpdateIdea} onConnectionStart={handleConnectionStart} onConnectionEnd={handleConnectionEnd} isConnecting={isConnecting} connectingFromId={connectingFromId} highlighted={hv || cn || sl} dimmed={!!(hoveredNodeId && !hv && !cn) && !sl} /></div>;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
