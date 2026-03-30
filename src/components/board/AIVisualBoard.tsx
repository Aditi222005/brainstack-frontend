import { useState, useEffect, useCallback } from 'react';
import { BoardToolbar } from './BoardToolbar';
import { BoardCanvas } from './BoardCanvas';
import { RightInsightPanel } from './RightInsightPanel';
import { FloatingActions } from './FloatingActions';
import { Idea } from './IdeaCard';
import { EdgeData } from './EdgeLine';
import { LegendPanel } from './LegendPanel';
import { EdgeType } from './boardTheme';

const API_BASE = 'http://localhost:5000/api';

export function AIVisualBoard() {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [edges, setEdges] = useState<EdgeData[]>([]);
    const [isInsightPanelOpen, setIsInsightPanelOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [insights, setInsights] = useState<any>(null);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

    // Fetch ideas and edges from backend on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ideasRes, edgesRes] = await Promise.all([
                    fetch(`${API_BASE}/ideas`, { credentials: 'include' }),
                    fetch(`${API_BASE}/edges`, { credentials: 'include' }),
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
    }, []);

    const handleAddIdea = async (initialData?: Partial<Idea>) => {
        const newIdea = {
            title: initialData?.title || 'New Idea',
            content: initialData?.content || 'Describe something new...',
            tags: initialData?.tags || ['#New'],
            color: initialData?.color || 'blue',
            x: initialData?.x ?? Math.round(window.innerWidth / 2 - 100 + (Math.random() * 800 - 400)),
            y: initialData?.y ?? Math.round(window.innerHeight / 2 - 50 + (Math.random() * 800 - 400)),
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
    }, []);

    const handleDeleteIdea = useCallback(async (id: string) => {
        // Optimistic UI update
        const removedIdea = ideas.find(i => i.id === id);
        const removedEdges = edges.filter(e => e.source === id || e.target === id);
        
        setIdeas(prev => prev.filter(idea => idea.id !== id));
        setEdges(prev => prev.filter(edge => edge.source !== id && edge.target !== id));

        try {
            const res = await fetch(`${API_BASE}/ideas/${id}`, { method: 'DELETE', credentials: 'include' });
            const data = await res.json();
            if (!data.success) {
                // Rollback if failed
                if (removedIdea) setIdeas(prev => [...prev, removedIdea]);
                if (removedEdges.length) setEdges(prev => [...prev, ...removedEdges]);
            }
            // backend now also deletes related edges, but we keep the redundant API call just in case or remove it.
        } catch (error) {
            console.error('[AIVisualBoard] Failed to delete idea:', error);
            if (removedIdea) setIdeas(prev => [...prev, removedIdea]);
            if (removedEdges.length) setEdges(prev => [...prev, ...removedEdges]);
        }
    }, [ideas, edges]);

    const handleClearBoard = useCallback(async () => {
        if (!window.confirm("Clear entire board? This cannot be undone.")) return;

        setIdeas([]);
        setEdges([]);
        setInsights(null);

        try {
            const res = await fetch(`${API_BASE}/boards/default/clear`, {
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
    }, []);

    const handleSummaryClick = async () => {
        setIsInsightPanelOpen(true);

        setIsGeneratingSummary(true);
        try {
            const res = await fetch(`${API_BASE}/ai/summary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ boardId: 'default' })
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

        try {
            const res = await fetch(`${API_BASE}/edges`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ source, target, type }),
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
    }, [edges]);

    const handleDeleteEdge = useCallback(async (edgeId: string) => {
        const removedEdge = edges.find(e => e.id === edgeId);
        setEdges(prev => prev.filter(e => e.id !== edgeId));

        try {
            const res = await fetch(`${API_BASE}/edges/${edgeId}`, { method: 'DELETE', credentials: 'include' });
            const data = await res.json();
            if (!data.success && removedEdge) setEdges(prev => [...prev, removedEdge]);
        } catch (error) {
            console.error('[AIVisualBoard] Failed to delete edge:', error);
            if (removedEdge) setEdges(prev => [...prev, removedEdge]);
        }
    }, [edges]);

    const handleAddConnection = useCallback(async (sourceTitle: string, targetTitle: string, type: EdgeType) => {
        const source = ideas.find(i => i.title.toLowerCase() === sourceTitle.toLowerCase());
        const target = ideas.find(i => i.title.toLowerCase() === targetTitle.toLowerCase());

        if (source && target) {
            handleCreateEdge(source.id, target.id, type);
        } else {
            console.warn(`[AIVisualBoard] Could not find nodes for connection: ${sourceTitle} → ${targetTitle}`);
        }
    }, [ideas, handleCreateEdge]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-[#0B0F19] text-[#E5E7EB] selection:bg-indigo-500/30 font-sans">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-indigo-400 text-lg animate-pulse tracking-widest font-bold">BRAINSTACK INITIALIZING...</div>
                </div>
            ) : (
                <>
                    <LegendPanel />
                    <BoardToolbar onAddIdea={handleAddIdea} onClearBoard={handleClearBoard} onSummaryClick={handleSummaryClick} />
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
