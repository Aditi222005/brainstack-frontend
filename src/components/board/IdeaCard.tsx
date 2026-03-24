import { motion } from 'framer-motion';
import { Tag, Sparkles } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';

export interface Idea {
    id: string;
    title: string;
    content: string;
    tags: string[];
    x: number;
    y: number;
}

interface IdeaCardProps {
    idea: Idea;
    onUpdate?: (id: string, updates: Partial<Idea>) => void;
}

export function IdeaCard({ idea, onUpdate }: IdeaCardProps) {
    const [title, setTitle] = useState(idea.title);
    const [content, setContent] = useState(idea.content);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync if parent idea prop changes (e.g. after fetch)
    useEffect(() => {
        setTitle(idea.title);
        setContent(idea.content);
    }, [idea.title, idea.content]);

    // Debounced save — waits 600ms after user stops typing, then calls onUpdate
    const debouncedSave = useCallback(
        (updates: Partial<Idea>) => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            debounceTimer.current = setTimeout(() => {
                console.log('[IdeaCard] Auto-saving:', idea.id, updates);
                onUpdate?.(idea.id, updates);
            }, 600);
        },
        [idea.id, onUpdate]
    );

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        debouncedSave({ title: newTitle });
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        debouncedSave({ content: newContent });
    };

    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ x: idea.x, y: idea.y, opacity: 0, scale: 0.9 }}
            animate={{ x: idea.x, y: idea.y, opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileDrag={{ scale: 1.05, zIndex: 50 }}
            style={{ position: 'absolute', left: 0, top: 0 }}
            className="bg-[#1a153a]/80 backdrop-blur-md border border-purple-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-shadow w-72 cursor-grab active:cursor-grabbing group"
        >
            <div className="flex justify-between items-start mb-2">
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    className="bg-transparent border-none outline-none text-purple-100 font-semibold w-full"
                    placeholder="Idea title..."
                />
                <Sparkles className="w-4 h-4 text-purple-400 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            <textarea
                value={content}
                onChange={handleContentChange}
                className="w-full bg-transparent border-none outline-none text-gray-300 text-sm resize-none h-20"
                placeholder="Describe your idea..."
            />
            <div className="flex gap-2 mt-3 flex-wrap">
                {idea.tags.map(tag => (
                    <span key={tag} className="flex items-center text-xs bg-purple-900/40 text-purple-200 px-2 py-1 rounded-md">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}
