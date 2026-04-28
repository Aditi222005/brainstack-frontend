import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { BoardToolbar } from './BoardToolbar';
import { BoardCanvas } from './BoardCanvas';
import { RightInsightPanel } from './RightInsightPanel';
import { FloatingActions } from './FloatingActions';
import { Idea } from './IdeaCard';
import { EdgeData } from './EdgeLine';
import { LegendPanel } from './LegendPanel';
import { EdgeType } from './boardTheme';

const API_BASE = 'http://localhost:5000/api';

/** Determines which mode the board is in based on router state. */
type BoardMode = 'scratch' | 'project' | 'board';

export function AIVisualBoard() {
    const location = useLocation();
    const selectedProjectId = (location.state as any)?.projectId ?? null;
    const selectedBoardId   = (location.state as any)?.boardId   ?? null;
    const boardContext      = (location.state as any)?.boardContext ?? null; // { projectName?, boardName? }
    const restoredSession   = (location.state as any)?.restoredSession ?? null; // from ChatHistory restore

    const mode: BoardMode = selectedBoardId
        ? 'board'
        : selectedProjectId
        ? 'project'
        : 'scratch';

    // Human-readable label shown in toolbar
    const boardLabel = useMemo(() => {
        if (mode === 'scratch') return '✦ Scratch Board';
        if (mode === 'board')   return boardContext?.boardName   ?? 'Sub Board';
        return boardContext?.projectName ?? 'Project Board';
    }, [mode, boardContext]);

    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [edges, setEdges] = useState<EdgeData[]>([]);
    const [isInsightPanelOpen, setIsInsightPanelOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [insights, setInsights] = useState<any>(null);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [autoConnectStatus, setAutoConnectStatus] = useState<{
        state: 'idle' | 'loading' | 'done' | 'error';
        message?: string;
        created?: number;
        skipped?: number;
    }>({ state: 'idle' });

    // Fetch ideas + edges from backend — ONLY in project/board mode
    useEffect(() => {
        // Scratch board: nothing to load from the DB
        if (mode === 'scratch') {
            // If restoring a saved session, pre-populate from it
            if (restoredSession) {
                const mappedIdeas: Idea[] = restoredSession.ideas.map((item: any) => ({
                    id: item.localId ?? `local-${Math.random()}`,
                    title: item.title,
                    content: item.content,
                    tags: item.tags || [],
                    color: item.color || 'blue',
                    x: item.x ?? Math.random() * 800,
                    y: item.y ?? Math.random() * 600,
                }));
                const mappedEdges: EdgeData[] = restoredSession.edges.map((e: any, i: number) => ({
                    id: `restored-edge-${i}`,
                    source: e.sourceLocalId,
                    target: e.targetLocalId,
                    type: e.type || 'relates_to',
                }));
                setIdeas(mappedIdeas);
                setEdges(mappedEdges);
            } else {
                setIdeas([]);
                setEdges([]);
            }
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                let ideasUrl: string;
                let edgesUrl: string;

                if (mode === 'board') {
                    ideasUrl = `${API_BASE}/boards/${selectedBoardId}/ideas`;
                    edgesUrl = `${API_BASE}/boards/${selectedBoardId}/edges`;
                } else {
                    // mode === 'project'
                    ideasUrl = `${API_BASE}/projects/${selectedProjectId}/ideas`;
                    edgesUrl = `${API_BASE}/projects/${selectedProjectId}/edges`;
                }

                const [ideasRes, edgesRes] = await Promise.all([
                    fetch(ideasUrl, { credentials: 'include' }),
                    fetch(edgesUrl, { credentials: 'include' }),
                ]);

                const ideasData = await ideasRes.json();
                const edgesData = await edgesRes.json();

                if (ideasData.success && ideasData.data) {
                    const mapped: Idea[] = ideasData.data.map((item: any) => ({
                        id: item._id,
                        title: item.title,
                        content: item.content,
                        tags: item.tags || [],
                        color: item.color || 'blue',
                        x: item.x ?? window.innerWidth / 2 - 140 + Math.random() * 100,
                        y: item.y ?? window.innerHeight / 2 - 80 + Math.random() * 100,
                    }));
                    setIdeas(mapped);
                }

                if (edgesData.success && edgesData.data) {
                    const mappedEdges: EdgeData[] = edgesData.data.map((item: any) => ({
                        id: item._id,
                        source: item.source,
                        target: item.target,
                        type: item.type || 'relates_to',
                    }));
                    setEdges(mappedEdges);
                }
            } catch (error) {
                console.error('[AIVisualBoard] Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [mode, selectedProjectId, selectedBoardId]);

    const handleAddIdea = async (initialData?: Partial<Idea>) => {
        const baseIdea = {
            title: initialData?.title || 'New Idea',
            content: initialData?.content || 'Describe something new...',
            tags: initialData?.tags || ['#New'],
            color: initialData?.color || 'blue',
            x: initialData?.x ?? Math.round(window.innerWidth / 2 - 100 + (Math.random() * 800 - 400)),
            y: initialData?.y ?? Math.round(window.innerHeight / 2 - 50 + (Math.random() * 800 - 400)),
        };

        // ── Scratch mode: add idea to local state only, no DB ──────────────
        if (mode === 'scratch') {
            const localIdea: Idea = { ...baseIdea, id: `local-${Date.now()}-${Math.random()}` };
            setIdeas(prev => [...prev, localIdea]);
            return localIdea;
        }

        const newIdea = {
            ...baseIdea,
            projectId: selectedProjectId || undefined,
            boardId: selectedBoardId || undefined,
        };

        try {
            const res = await fetch(`${API_BASE}/ideas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newIdea),
            });
            const data = await res.json();
            if (data.success && data.data) {
                const created: Idea = {
                    id: data.data._id,
                    title: data.data.title,
                    content: data.data.content,
                    tags: data.data.tags || [],
                    color: data.data.color || 'blue',
                    x: data.data.x,
                    y: data.data.y,
                };
                setIdeas(prev => [...prev, created]);
                return created;
            }
        } catch (error) {
            console.error('[AIVisualBoard] Failed to create idea:', error);
        }
        return null;
    };

    const handleUpdateIdea = useCallback(async (id: string, updates: Partial<Idea>) => {
        // Optimistic UI update
        setIdeas(prev => prev.map(idea => idea.id === id ? { ...idea, ...updates } : idea));

        // Scratch board or local-only idea: no DB needed
        if (mode === 'scratch' || id.startsWith('local-')) return;

        try {
            const res = await fetch(`${API_BASE}/ideas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updates),
            });
            const data = await res.json();

            if (data.success && data.data) {
                setIdeas(prev => prev.map(idea => idea.id === id ? { ...idea, ...data.data, id: data.data._id } : idea));
            }
        } catch (error) {
            console.error('[AIVisualBoard] Failed to update idea:', error);
        }
    }, [mode]);

    const handleDeleteIdea = useCallback(async (id: string) => {
        // Optimistic UI update
        const removedIdea = ideas.find(i => i.id === id);
        const removedEdges = edges.filter(e => e.source === id || e.target === id);
        
        setIdeas(prev => prev.filter(idea => idea.id !== id));
        setEdges(prev => prev.filter(edge => edge.source !== id && edge.target !== id));

        // Scratch board or local-only idea: no DB needed
        if (mode === 'scratch' || id.startsWith('local-')) return;

        try {
            const res = await fetch(`${API_BASE}/ideas/${id}`, { method: 'DELETE', credentials: 'include' });
            const data = await res.json();
            if (!data.success) {
                // Rollback if failed
                if (removedIdea) setIdeas(prev => [...prev, removedIdea]);
                if (removedEdges.length) setEdges(prev => [...prev, ...removedEdges]);
            }
        } catch (error) {
            console.error('[AIVisualBoard] Failed to delete idea:', error);
            if (removedIdea) setIdeas(prev => [...prev, removedIdea]);
            if (removedEdges.length) setEdges(prev => [...prev, ...removedEdges]);
        }
    }, [ideas, edges, mode]);

    const handleClearBoard = useCallback(async () => {
        if (!window.confirm("Clear entire board? This cannot be undone.")) return;

        setIdeas([]);
        setEdges([]);
        setInsights(null);

        // Scratch board: nothing to clear on backend
        if (mode === 'scratch') return;

        try {
            // Delete all ideas (and their edges) in this project/board scope
            const scopeParam = mode === 'board'
                ? `boardId=${selectedBoardId}`
                : `projectId=${selectedProjectId}`;
            const res = await fetch(`${API_BASE}/ideas/clear?${scopeParam}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await res.json();
            if (!data.success) {
                console.error('[AIVisualBoard] Failed to clear board on backend');
            }
        } catch (error) {
            console.error('[AIVisualBoard] Clear board error:', error);
        }
    }, [mode, selectedProjectId, selectedBoardId]);

    const handleSummaryClick = async () => {
        setIsInsightPanelOpen(true);

        setIsGeneratingSummary(true);
        try {
            const res = await fetch(`${API_BASE}/ai/summary`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    projectId: selectedProjectId || undefined,
                    boardId: selectedBoardId || undefined
                })
            });
            const data = await res.json();
            setInsights(data);
        } catch (error) {
            console.error('Failed to generate summary', error);
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const handleCreateEdge = useCallback(async (source: string, target: string, type: EdgeType = 'relates_to') => {
        const isDuplicate = edges.some(e => e.source === source && e.target === target && e.type === type);
        if (isDuplicate) return;

        const tempId = `temp-${Date.now()}`;
        const optimisticEdge: EdgeData = { id: tempId, source, target, type };
        setEdges(prev => [...prev, optimisticEdge]);

        // Scratch board: keep edge local only
        if (mode === 'scratch') return;

        try {
            const res = await fetch(`${API_BASE}/edges`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    source,
                    target,
                    type,
                    projectId: mode === 'project' ? selectedProjectId : undefined,
                    boardId:   mode === 'board'   ? selectedBoardId   : undefined,
                }),
            });
            const data = await res.json();
            if (data.success && data.data) {
                setEdges(prev => prev.map(e => e.id === tempId ? { id: data.data._id, source: data.data.source, target: data.data.target, type: data.data.type } : e));
            } else {
                setEdges(prev => prev.filter(e => e.id !== tempId));
            }
        } catch (error) {
            console.error('[AIVisualBoard] Failed to create edge:', error);
            setEdges(prev => prev.filter(e => e.id !== tempId));
        }
    }, [edges, mode, selectedProjectId, selectedBoardId]);

    const handleDeleteEdge = useCallback(async (edgeId: string) => {
        const removedEdge = edges.find(e => e.id === edgeId);
        setEdges(prev => prev.filter(e => e.id !== edgeId));

        // Scratch board: local delete only
        if (mode === 'scratch' || edgeId.startsWith('temp-')) return;

        try {
            const res = await fetch(`${API_BASE}/edges/${edgeId}`, { method: 'DELETE', credentials: 'include' });
            const data = await res.json();
            if (!data.success && removedEdge) setEdges(prev => [...prev, removedEdge]);
        } catch (error) {
            console.error('[AIVisualBoard] Failed to delete edge:', error);
            if (removedEdge) setEdges(prev => [...prev, removedEdge]);
        }
    }, [edges, mode]);

    const handleAddConnection = useCallback(async (sourceTitle: string, targetTitle: string, type: EdgeType) => {
        const source = ideas.find(i => i.title.toLowerCase() === sourceTitle.toLowerCase());
        const target = ideas.find(i => i.title.toLowerCase() === targetTitle.toLowerCase());

        if (source && target) {
            handleCreateEdge(source.id, target.id, type);
        } else {
            console.warn(`[AIVisualBoard] Could not find nodes for connection: ${sourceTitle} → ${targetTitle}`);
        }
    }, [ideas, handleCreateEdge]);

    const handleAutoConnect = useCallback(async () => {
        if (ideas.length < 2) {
            setAutoConnectStatus({ state: 'done', message: 'Add at least 2 idea cards first!', created: 0, skipped: 0 });
            setTimeout(() => setAutoConnectStatus({ state: 'idle' }), 3000);
            return;
        }

        setAutoConnectStatus({ state: 'loading' });

        try {
            const res = await fetch(`${API_BASE}/edges/auto-connect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    projectId: selectedProjectId || undefined,
                    boardId: selectedBoardId || undefined 
                })
            });
            const data = await res.json();

            if (data.success && data.edges && data.edges.length > 0) {
                // Merge new edges into state without a full re-fetch
                const newEdges: EdgeData[] = data.edges.map((e: any) => ({
                    id: e.id,
                    source: e.source,
                    target: e.target,
                    type: e.type || 'relates_to',
                }));

                setEdges(prev => {
                    const existingIds = new Set(prev.map(e => e.id));
                    const deduplicated = newEdges.filter(e => !existingIds.has(e.id));
                    return [...prev, ...deduplicated];
                });

                setAutoConnectStatus({
                    state: 'done',
                    message: data.message,
                    created: data.created,
                    skipped: data.skipped,
                });
            } else {
                setAutoConnectStatus({
                    state: 'done',
                    message: data.message || 'No new connections found.',
                    created: 0,
                    skipped: data.skipped || 0,
                });
            }
        } catch (error) {
            console.error('[AIVisualBoard] Auto-connect failed:', error);
            setAutoConnectStatus({ state: 'error', message: 'Failed to connect. Try again.' });
        } finally {
            setTimeout(() => setAutoConnectStatus({ state: 'idle' }), 4500);
        }
    }, [ideas]);

    // ── Save scratch board to history ─────────────────────────────────────────
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    const handleSaveToHistory = useCallback(async () => {
        if (mode !== 'scratch' || ideas.length === 0) return;
        setSaveStatus('saving');
        try {
            const payload = {
                title: `Scratch — ${new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`,
                ideas: ideas.map(idea => ({
                    localId: idea.id,
                    title: idea.title,
                    content: idea.content,
                    tags: idea.tags,
                    color: idea.color,
                    x: idea.x,
                    y: idea.y,
                })),
                edges: edges.map(edge => ({
                    sourceLocalId: edge.source,
                    targetLocalId: edge.target,
                    type: edge.type,
                })),
            };
            const res = await fetch(`${API_BASE}/scratch-sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 2000);
            } else {
                setSaveStatus('error');
                setTimeout(() => setSaveStatus('idle'), 3000);
            }
        } catch (err) {
            console.error('[AIVisualBoard] Save to history failed:', err);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    }, [mode, ideas, edges]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-[#0B0F19] text-[#E5E7EB] selection:bg-indigo-500/30 font-sans">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-indigo-400 text-lg animate-pulse tracking-widest font-bold">BRAINSTACK INITIALIZING...</div>
                </div>
            ) : (
                <>
                    <LegendPanel />
                    <BoardToolbar
                        onAddIdea={handleAddIdea}
                        onClearBoard={handleClearBoard}
                        onSummaryClick={handleSummaryClick}
                        onAutoConnect={mode !== 'scratch' ? handleAutoConnect : undefined}
                        autoConnectStatus={autoConnectStatus}
                        boardLabel={boardLabel}
                        isScratch={mode === 'scratch'}
                        onSaveToHistory={mode === 'scratch' ? handleSaveToHistory : undefined}
                        saveStatus={saveStatus}
                    />
                    <BoardCanvas
                        ideas={ideas}
                        edges={edges}
                        onUpdateIdea={handleUpdateIdea}
                        onCreateEdge={handleCreateEdge}
                        onDeleteEdge={handleDeleteEdge}
                        onDeleteIdea={handleDeleteIdea}
                    />
                    <RightInsightPanel
                        isOpen={isInsightPanelOpen}
                        togglePanel={() => setIsInsightPanelOpen(!isInsightPanelOpen)}
                        insights={insights}
                        isLoading={isGeneratingSummary}
                        onAddIdea={handleAddIdea}
                        onAddConnection={handleAddConnection}
                    />
                    <FloatingActions onAddIdea={handleAddIdea} />
                </>
            )}
        </div>
    );
}
