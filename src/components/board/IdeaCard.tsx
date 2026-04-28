import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Tag, Sparkles, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
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
    onDelete?: (id: string) => void;
}

export const IdeaCard = memo(function IdeaCard({
    idea, onUpdate, onConnectionStart, onConnectionEnd,
    isConnecting = false, connectingFromId = null,
    dimmed = false, highlighted = false, onDelete,
}: IdeaCardProps) {
    const [title, setTitle] = useState(idea.title);
    const [content, setContent] = useState(idea.content);
    const [isEditingContent, setIsEditingContent] = useState(false);
    const [position, setPosition] = useState({ x: idea.x, y: idea.y });
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const colorStyle = NODE_COLORS[idea.color || 'blue'];
    const isValidTarget = isConnecting && connectingFromId !== idea.id;

    useEffect(() => { setTitle(idea.title); setContent(idea.content); }, [idea.title, idea.content]);
    useEffect(() => { setPosition({ x: idea.x, y: idea.y }); }, [idea.x, idea.y]);

    const debouncedSave = useCallback((updates: Partial<Idea>) => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => { onUpdate?.(idea.id, updates); }, 600);
    }, [idea.id, onUpdate]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const v = e.target.value; setTitle(v); debouncedSave({ title: v }); };
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { const v = e.target.value; setContent(v); debouncedSave({ content: v }); };
    const handleColorChange = (newColor: NodeColor) => { onUpdate?.(idea.id, { color: newColor }); };

    const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const newX = Math.round(position.x + info.offset.x);
        const newY = Math.round(position.y + info.offset.y);
        setPosition({ x: newX, y: newY });
        onUpdate?.(idea.id, { x: newX, y: newY });
    }, [idea.id, onUpdate, position.x, position.y]);

    return (
        <motion.div
            drag={!isConnecting}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            initial={{ x: position.x, y: position.y, opacity: 0, scale: 0.9 }}
            animate={{
                opacity: dimmed ? 0.3 : 1,
                scale: highlighted ? 1.03 : 1,
                boxShadow: highlighted
                    ? `0 0 0 1.5px ${colorStyle.dot}55, 0 0 28px ${colorStyle.dot}20`
                    : `0 4px 16px rgba(0,0,0,0.35)`,
                zIndex: isConnecting || highlighted ? 50 : 10,
            }}
            whileHover={{ scale: isConnecting ? 1 : 1.015 }}
            style={{
                position: 'absolute',
                left: 0, top: 0,
                x: position.x, y: position.y,
                width: 288,
                background: 'rgba(11,15,26,0.90)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: 16,
                border: isValidTarget
                    ? '1.5px solid var(--color-secondary)'
                    : highlighted
                        ? `1.5px solid ${colorStyle.dot}50`
                        : `0.5px solid ${colorStyle.dot}28`,
                padding: 16,
                cursor: 'grab',
                transition: 'border-color 0.2s ease, opacity 0.3s ease',
                filter: dimmed ? 'grayscale(0.25)' : 'none',
            }}
            className="group active:cursor-grabbing"
        >
            {/* Connection Handles */}
            {(['left', 'right', 'top', 'bottom'] as const).map(side => (
                <ConnectionHandle key={side} nodeId={idea.id} side={side}
                    onConnectionStart={onConnectionStart!} onConnectionEnd={onConnectionEnd!}
                    isConnecting={isConnecting} isValidTarget={isValidTarget} />
            ))}

            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                {/* Color accent dot */}
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: colorStyle.dot, boxShadow: `0 0 8px ${colorStyle.dot}80`, flexShrink: 0 }} />
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    style={{
                        background: 'transparent', border: 'none', outline: 'none',
                        fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14,
                        color: 'var(--color-text)', flex: 1,
                        letterSpacing: '-0.01em',
                    }}
                    placeholder="Idea title..."
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <ColorPicker currentColor={idea.color || 'blue'} onChange={handleColorChange} />
                    <Sparkles style={{ width: 13, height: 13, color: colorStyle.dot, opacity: 0.45, transition: 'opacity 0.2s' }} className="group-hover:opacity-100" />
                    {onDelete && (
                        <button
                            title="Delete Idea"
                            onClick={(e) => { e.stopPropagation(); onDelete(idea.id); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, opacity: 0, color: '#ef4444', transition: 'opacity 0.2s, background 0.2s' }}
                            className="group-hover:!opacity-100 hover:!bg-[rgba(239,68,68,0.1)]"
                        >
                            <Trash2 style={{ width: 13, height: 13 }} />
                        </button>
                    )}
                </div>
            </div>

            {/* Content area */}
            {isEditingContent ? (
                <textarea
                    autoFocus
                    value={content}
                    onChange={handleContentChange}
                    onBlur={() => setIsEditingContent(false)}
                    style={{
                        width: '100%', background: 'transparent', border: 'none', outline: 'none',
                        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 400,
                        color: 'rgba(232,234,240,0.7)', resize: 'none', minHeight: '5rem',
                        lineHeight: 1.6,
                    }}
                    placeholder="Describe your idea..."
                />
            ) : (
                <div
                    onClick={() => setIsEditingContent(true)}
                    style={{
                        minHeight: '5rem', cursor: 'text',
                        background: 'rgba(255,255,255,0.025)',
                        border: '0.5px solid rgba(255,255,255,0.06)',
                        borderRadius: 10, padding: '10px 12px',
                    }}
                >
                    <div className="prose prose-invert prose-sm max-w-none leading-relaxed"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(232,234,240,0.65)' }}>
                        <ReactMarkdown>
                            {content || 'Click to describe your idea...'}
                        </ReactMarkdown>
                    </div>
                </div>
            )}

            {/* Tags */}
            {idea.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                    {idea.tags.map(tag => (
                        <span key={tag}
                            className={`${colorStyle.tagBg} ${colorStyle.text}`}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
                                textTransform: 'uppercase', padding: '2px 8px', borderRadius: 99,
                                border: '0.5px solid rgba(255,255,255,0.06)',
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            <Tag style={{ width: 9, height: 9 }} />
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </motion.div>
    );
});
