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

    const handleAddIdea = async () => {
        const newIdea = {
            title: 'New Idea',
            content: 'Describe something new...',
            tags: ['#New'],
            color: 'blue',
            x: Math.round(window.innerWidth / 2 - 100 + (Math.random() * 80 - 40)),
            y: Math.round(window.innerHeight / 2 - 50 + (Math.random() * 80 - 40)),
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
            }
        } catch (error) {
            console.error('[AIVisualBoard] Failed to create idea:', error);
        }
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

    const handleDeleteIdea = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE}/ideas/${id}`, { method: 'DELETE', credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setIdeas(prev => prev.filter(idea => idea.id !== id));
                setEdges(prev => prev.filter(edge => edge.source !== id && edge.target !== id));
                fetch(`${API_BASE}/edges/by-node/${id}`, { method: 'DELETE', credentials: 'include' });
            }
        } catch (error) {
            console.error('[AIVisualBoard] Failed to delete idea:', error);
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

    return (
        <div className="relative w-full h-full overflow-hidden bg-[#0B0F19] text-[#E5E7EB] selection:bg-indigo-500/30 font-sans">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-indigo-400 text-lg animate-pulse tracking-widest font-bold">BRAINSTACK INITIALIZING...</div>
                </div>
            ) : (
                <>
                    <LegendPanel />
                    <BoardToolbar onAddIdea={handleAddIdea} />
                    <BoardCanvas
                        ideas={ideas}
                        edges={edges}
                        onUpdateIdea={handleUpdateIdea}
                        onCreateEdge={handleCreateEdge}
                        onDeleteEdge={handleDeleteEdge}
                    />
                    <RightInsightPanel
                        isOpen={isInsightPanelOpen}
                        togglePanel={() => setIsInsightPanelOpen(!isInsightPanelOpen)}
                    />
                    <FloatingActions onAddIdea={handleAddIdea} />
                </>
            )}
        </div>
    );
}
