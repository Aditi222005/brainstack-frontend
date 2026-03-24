import { useState, useEffect, useCallback } from 'react';
import { BoardToolbar } from './BoardToolbar';
import { BoardCanvas } from './BoardCanvas';
import { RightInsightPanel } from './RightInsightPanel';
import { FloatingActions } from './FloatingActions';
import { Idea } from './IdeaCard';

const API_BASE = 'http://localhost:5000/api';

export function AIVisualBoard() {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isInsightPanelOpen, setIsInsightPanelOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch ideas from backend on mount
    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                console.log('[AIVisualBoard] Fetching ideas...');
                const res = await fetch(`${API_BASE}/ideas`, {
                    credentials: 'include',
                });
                const data = await res.json();
                console.log('[AIVisualBoard] Fetch response:', data);

                if (data.success && data.data) {
                    // Map _id to id for frontend compatibility  
                    const mapped: Idea[] = data.data.map((item: any) => ({
                        id: item._id,
                        title: item.title,
                        content: item.content,
                        tags: item.tags || [],
                        x: item.x ?? window.innerWidth / 2 - 140 + Math.random() * 100,
                        y: item.y ?? window.innerHeight / 2 - 80 + Math.random() * 100,
                    }));
                    setIdeas(mapped);
                }
            } catch (error) {
                console.error('[AIVisualBoard] Failed to fetch ideas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIdeas();
    }, []);

    // Add a new idea → POST to backend then update state
    const handleAddIdea = async () => {
        const newIdea = {
            title: 'New Idea',
            content: 'Concept details...',
            tags: ['#Draft'],
            x: Math.round(window.innerWidth / 2 - 100 + (Math.random() * 80 - 40)),
            y: Math.round(window.innerHeight / 2 - 50 + (Math.random() * 80 - 40)),
        };

        try {
            console.log('[AIVisualBoard] Creating idea...');
            const res = await fetch(`${API_BASE}/ideas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newIdea),
            });
            const data = await res.json();
            console.log('[AIVisualBoard] Create response:', data);

            if (data.success && data.data) {
                const created: Idea = {
                    id: data.data._id,
                    title: data.data.title,
                    content: data.data.content,
                    tags: data.data.tags || [],
                    x: data.data.x,
                    y: data.data.y,
                };
                setIdeas(prev => [...prev, created]);
            }
        } catch (error) {
            console.error('[AIVisualBoard] Failed to create idea:', error);
        }
    };

    // Update an idea → PUT to backend then update local state
    const handleUpdateIdea = useCallback(async (id: string, updates: Partial<Idea>) => {
        try {
            console.log('[AIVisualBoard] Updating idea:', id, updates);
            const res = await fetch(`${API_BASE}/ideas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updates),
            });
            const data = await res.json();
            console.log('[AIVisualBoard] Update response:', data);

            if (data.success && data.data) {
                setIdeas(prev =>
                    prev.map(idea =>
                        idea.id === id
                            ? {
                                ...idea,
                                title: data.data.title,
                                content: data.data.content,
                                tags: data.data.tags || idea.tags,
                                x: data.data.x ?? idea.x,
                                y: data.data.y ?? idea.y,
                            }
                            : idea
                    )
                );
            }
        } catch (error) {
            console.error('[AIVisualBoard] Failed to update idea:', error);
        }
    }, []);

    // Delete an idea → DELETE from backend then update state
    const handleDeleteIdea = async (id: string) => {
        try {
            console.log('[AIVisualBoard] Deleting idea:', id);
            const res = await fetch(`${API_BASE}/ideas/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            console.log('[AIVisualBoard] Delete response:', data);

            if (data.success) {
                setIdeas(prev => prev.filter(idea => idea.id !== id));
            }
        } catch (error) {
            console.error('[AIVisualBoard] Failed to delete idea:', error);
        }
    };

    return (
        <div className="relative w-full h-full overflow-hidden bg-black text-white selection:bg-purple-500/30 font-sans">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-purple-400 text-lg animate-pulse">Loading your ideas...</div>
                </div>
            ) : (
                <>
                    <BoardToolbar onAddIdea={handleAddIdea} />
                    <BoardCanvas ideas={ideas} onUpdateIdea={handleUpdateIdea} />
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
