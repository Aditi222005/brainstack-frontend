import { useRef } from 'react';
import { motion } from 'framer-motion';
import { IdeaCard, Idea } from './IdeaCard';

interface BoardCanvasProps {
    ideas: Idea[];
    onUpdateIdea?: (id: string, updates: Partial<Idea>) => void;
}

export function BoardCanvas({ ideas, onUpdateIdea }: BoardCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Smooth grid pattern background using CSS or Tailwind
    return (
        <div
            ref={containerRef}
            className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#0b081c] to-black overflow-hidden"
        >
            <div
                className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(168, 85, 247, 0.4) 1px, transparent 0)
          `,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="relative w-full h-full z-10">
                {ideas.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} onUpdate={onUpdateIdea} />
                ))}
            </div>
        </div>
    );
}
