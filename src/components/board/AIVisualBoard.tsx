import { useState } from 'react';
import { BoardToolbar } from './BoardToolbar';
import { BoardCanvas } from './BoardCanvas';
import { RightInsightPanel } from './RightInsightPanel';
import { FloatingActions } from './FloatingActions';
import { Idea } from './IdeaCard';

const INITIAL_IDEAS: Idea[] = [
    {
        id: '1',
        title: 'AI Visual Board',
        content: 'User interface for infinite canvas where AI parses thoughts into nodes dynamically.',
        tags: ['#UI', '#Core', '#Design'],
        x: window.innerWidth / 2 - 350,
        y: window.innerHeight / 2 - 150,
    },
    {
        id: '2',
        title: 'Draggable Layout',
        content: 'Use Framer Motion to provide high-performance fluid drag and physics. Gravity interactions.',
        tags: ['#Physics', '#FrontEnd'],
        x: window.innerWidth / 2 + 50,
        y: window.innerHeight / 2 - 60,
    },
    {
        id: '3',
        title: 'Brainstack Backend',
        content: 'Connect the visual board to the vector database for auto-clustering ideas by semantic similarity.',
        tags: ['#Backend', '#AI', '#VDB'],
        x: window.innerWidth / 2 - 150,
        y: window.innerHeight / 2 + 100,
    }
];

export function AIVisualBoard() {
    const [ideas, setIdeas] = useState<Idea[]>(INITIAL_IDEAS);
    const [isInsightPanelOpen, setIsInsightPanelOpen] = useState(false);

    return (
        <div className="relative w-full h-full overflow-hidden bg-black text-white selection:bg-purple-500/30 font-sans">
            <BoardToolbar />
            <BoardCanvas ideas={ideas} />
            <RightInsightPanel
                isOpen={isInsightPanelOpen}
                togglePanel={() => setIsInsightPanelOpen(!isInsightPanelOpen)}
            />
            <FloatingActions />
        </div>
    );
}
