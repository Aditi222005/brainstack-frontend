import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Tag, Sparkles } from 'lucide-react';
import { ConnectionHandle } from './ConnectionHandle';
import { NodeColor, NODE_COLORS } from './boardTheme';
import { ColorPicker } from './ColorPicker';

export interface Idea {
    id: string;
    title: string;
    content: string;
    tags: string[];
    color: NodeColor;
    x: number;
    y: number;
}

interface IdeaCardProps {
    idea: Idea;
    onUpdate?: (id: string, updates: Partial<Idea>) => void;
    onConnectionStart?: (nodeId: string, side: string, e: React.PointerEvent) => void;
    onConnectionEnd?: (nodeId: string) => void;
    isConnecting?: boolean;
    connectingFromId?: string | null;
    dimmed?: boolean;
    highlighted?: boolean;
}

export const IdeaCard = memo(function IdeaCard({
    idea,
    onUpdate,
    onConnectionStart,
    onConnectionEnd,
    isConnecting = false,
    connectingFromId = null,
    dimmed = false,
    highlighted = false,
}: IdeaCardProps) {
    const [title, setTitle] = useState(idea.title);
    const [content, setContent] = useState(idea.content);
    const [position, setPosition] = useState({ x: idea.x, y: idea.y });
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Color system config
    const colorStyle = NODE_COLORS[idea.color || 'blue'];
    const isValidTarget = isConnecting && connectingFromId !== idea.id;

    useEffect(() => {
        setTitle(idea.title);
        setContent(idea.content);
    }, [idea.title, idea.content]);

    useEffect(() => {
        setPosition({ x: idea.x, y: idea.y });
    }, [idea.x, idea.y]);

    const debouncedSave = useCallback(
        (updates: Partial<Idea>) => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            debounceTimer.current = setTimeout(() => {
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

    const handleColorChange = (newColor: NodeColor) => {
        onUpdate?.(idea.id, { color: newColor });
    };

    const handleDragEnd = useCallback(
        (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
            const newX = Math.round(position.x + info.offset.x);
            const newY = Math.round(position.y + info.offset.y);
            setPosition({ x: newX, y: newY });
            onUpdate?.(idea.id, { x: newX, y: newY });
        },
        [idea.id, onUpdate, position.x, position.y]
    );

    return (
        <motion.div
            drag={!isConnecting}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            initial={{ x: position.x, y: position.y, opacity: 0, scale: 0.9 }}
            animate={{ 
                opacity: dimmed ? 0.35 : 1,
                scale: highlighted ? 1.05 : 1,
                boxShadow: highlighted ? `0 0 35px ${colorStyle.dot}40` : undefined,
                zIndex: isConnecting || highlighted ? 50 : 10
            }}
            whileHover={{ scale: isConnecting ? 1 : 1.02 }}
            style={{ position: 'absolute', left: 0, top: 0, x: position.x, y: position.y }}
            className={`bg-card/90 backdrop-blur-md rounded-xl p-4 transition-all duration-300 w-72 cursor-grab active:cursor-grabbing group border-2
                ${isValidTarget ? 'border-secondary !opacity-100 shadow-[0_0_30px_hsl(var(--secondary)/0.4)]' : colorStyle.border}
                ${highlighted ? `!border-foreground/40 ${colorStyle.glow}` : colorStyle.glow}
                ${dimmed ? 'grayscale-[0.3]' : ''}
                surface-elevated
            `}
        >
            {/* Connection Handles */}
            <ConnectionHandle nodeId={idea.id} side="left" onConnectionStart={onConnectionStart} onConnectionEnd={onConnectionEnd} isConnecting={isConnecting} isValidTarget={isValidTarget} />
            <ConnectionHandle nodeId={idea.id} side="right" onConnectionStart={onConnectionStart} onConnectionEnd={onConnectionEnd} isConnecting={isConnecting} isValidTarget={isValidTarget} />
            <ConnectionHandle nodeId={idea.id} side="top" onConnectionStart={onConnectionStart} onConnectionEnd={onConnectionEnd} isConnecting={isConnecting} isValidTarget={isValidTarget} />
            <ConnectionHandle nodeId={idea.id} side="bottom" onConnectionStart={onConnectionStart} onConnectionEnd={onConnectionEnd} isConnecting={isConnecting} isValidTarget={isValidTarget} />

            <div className="flex justify-between items-center mb-2 gap-2">
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    className="bg-transparent border-none outline-none text-foreground font-bold w-full text-lg"
                    placeholder="Idea title..."
                />
                <div className="flex items-center gap-2">
                    <ColorPicker currentColor={idea.color || 'blue'} onChange={handleColorChange} />
                    <Sparkles className={`w-3.5 h-3.5 ${colorStyle.text} opacity-50 group-hover:opacity-100 transition-opacity`} />
                </div>
            </div>
            
            <textarea
                value={content}
                onChange={handleContentChange}
                className="w-full bg-transparent border-none outline-none text-foreground/70 text-sm resize-none h-20 leading-relaxed font-normal"
                placeholder="Describe your idea..."
            />

            <div className="flex gap-2 mt-3 flex-wrap">
                {idea.tags.map(tag => (
                    <span key={tag} className={`flex items-center text-[10px] font-semibold tracking-wider uppercase ${colorStyle.tagBg} ${colorStyle.text} px-2 py-0.5 rounded-md border border-white/5`}>
                        <Tag className="w-2.5 h-2.5 mr-1" />
                        {tag}
                    </span>
                ))}
            </div>
        </motion.div>
    );
});
