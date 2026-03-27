import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';

import { EdgeType, EDGE_TYPES } from './boardTheme';

export interface EdgeData {
    id: string;
    source: string;
    target: string;
    type?: EdgeType;
}

interface EdgeLineProps {
    edge: EdgeData;
    sourcePos: { x: number; y: number };
    targetPos: { x: number; y: number };
    onDelete?: (edgeId: string) => void;
    dimmed?: boolean;
}

const CARD_WIDTH = 288;
const CARD_HEIGHT = 180;

function getBezierPath(
    sx: number, sy: number,
    tx: number, ty: number,
    type: EdgeType = 'relates_to'
) {
    let fromX, fromY, toX, toY;
    let cpFromX, cpFromY, cpToX, cpToY;

    const dx = tx - sx;
    const dy = ty - sy;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            fromX = sx + CARD_WIDTH;
            fromY = sy + CARD_HEIGHT / 2;
            toX = tx;
            toY = ty + CARD_HEIGHT / 2;
        } else {
            fromX = sx;
            fromY = sy + CARD_HEIGHT / 2;
            toX = tx + CARD_WIDTH;
            toY = ty + CARD_HEIGHT / 2;
        }
        let cpOffset = Math.min(Math.abs(fromX - toX) * 0.4, 120);
        if (type === 'contradicts') cpOffset = 20;

        cpFromX = fromX + (toX > fromX ? cpOffset : -cpOffset);
        cpFromY = fromY;
        cpToX = toX + (toX > fromX ? -cpOffset : cpOffset);
        cpToY = toY;
    } else {
        if (dy > 0) {
            fromX = sx + CARD_WIDTH / 2;
            fromY = sy + CARD_HEIGHT;
            toX = tx + CARD_WIDTH / 2;
            toY = ty;
        } else {
            fromX = sx + CARD_WIDTH / 2;
            fromY = sy;
            toX = tx + CARD_WIDTH / 2;
            toY = ty + CARD_HEIGHT;
        }
        let cpOffset = Math.min(Math.abs(fromY - toY) * 0.4, 120);
        if (type === 'contradicts') cpOffset = 20;

        cpFromX = fromX;
        cpFromY = fromY + (toY > fromY ? cpOffset : -cpOffset);
        cpToX = toX;
        cpToY = toY + (toY > fromY ? -cpOffset : cpOffset);
    }

    return {
        path: `M ${fromX} ${fromY} C ${cpFromX} ${cpFromY}, ${cpToX} ${cpToY}, ${toX} ${toY}`,
        midX: (fromX + toX) / 2,
        midY: (fromY + toY) / 2,
    };
}

export const EdgeLine = memo(function EdgeLine({ edge, sourcePos, targetPos, onDelete, dimmed = false }: EdgeLineProps) {
    const [hovered, setHovered] = useState(false);
    const type = edge.type || 'relates_to';
    const config = EDGE_TYPES[type];

    const { path, midX, midY } = getBezierPath(
        sourcePos.x, sourcePos.y,
        targetPos.x, targetPos.y,
        type
    );

    return (
        <g
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                cursor: hovered ? 'pointer' : 'default',
                opacity: dimmed ? 0.3 : 1,
                transition: 'opacity 0.3s ease'
            }}
        >
            <path d={path} fill="none" stroke="transparent" strokeWidth={20} style={{ pointerEvents: 'auto' }} />

            <motion.path
                d={path}
                fill="none"
                stroke={hovered ? config.color : config.strokeColor}
                strokeWidth={hovered ? 3 : 2}
                strokeDasharray={config.dashArray !== '0' ? config.dashArray : 'none'}
                initial={false}
                animate={{
                    strokeDashoffset: config.dashArray !== '0' ? [0, -18] : 0,
                }}
                transition={{
                    strokeDashoffset: { duration: 2, repeat: Infinity, ease: 'linear' },
                }}
            />

            {(hovered || type === 'inspired_by') && (
                <motion.path
                    d={path}
                    fill="none"
                    stroke={config.glowColor}
                    strokeWidth={hovered ? 12 : 8}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}

            {hovered && (
                <foreignObject x={midX - 50} y={midY - 25} width="100" height="20" className="pointer-events-none">
                    <div className="flex items-center justify-center">
                        <span className="bg-[#1F2937]/90 text-[10px] text-white px-2 py-0.5 rounded-full border border-white/10 whitespace-nowrap shadow-xl">
                            {config.icon} {config.label}
                        </span>
                    </div>
                </foreignObject>
            )}

            {hovered && onDelete && (
                <motion.g
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(edge.id);
                    }}
                >
                    <circle cx={midX} cy={midY + 15} r={10} fill="#1F2937" stroke="rgba(239, 68, 68, 0.6)" strokeWidth={1.5} />
                    <line x1={midX - 3} y1={midY + 12} x2={midX + 3} y2={midY + 18} stroke="#EF4444" strokeWidth={1.2} />
                    <line x1={midX + 3} y1={midY + 12} x2={midX - 3} y2={midY + 18} stroke="#EF4444" strokeWidth={1.2} />
                </motion.g>
            )}
        </g>
    );
});

interface DraftEdgeLineProps {
    fromPos: { x: number; y: number };
    toPos: { x: number; y: number };
}

export function DraftEdgeLine({ fromPos, toPos }: DraftEdgeLineProps) {
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    let cpFromX = fromPos.x;
    let cpFromY = fromPos.y;
    let cpToX = toPos.x;
    let cpToY = toPos.y;

    if (Math.abs(dx) > Math.abs(dy)) {
        const cpOffset = Math.min(Math.abs(dx) * 0.4, 100);
        cpFromX += (dx > 0 ? cpOffset : -cpOffset);
        cpToX += (dx > 0 ? -cpOffset : cpOffset);
    } else {
        const cpOffset = Math.min(Math.abs(dy) * 0.4, 100);
        cpFromY += (dy > 0 ? cpOffset : -cpOffset);
        cpToY += (dy > 0 ? -cpOffset : cpOffset);
    }
    
    const path = `M ${fromPos.x} ${fromPos.y} C ${cpFromX} ${cpFromY}, ${cpToX} ${cpToY}, ${toPos.x} ${toPos.y}`;

    return (
        <motion.path
            d={path}
            fill="none"
            stroke="rgba(6, 182, 212, 0.6)"
            strokeWidth={2}
            strokeDasharray="8 4"
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                strokeDashoffset: [0, -24],
            }}
            transition={{
                opacity: { duration: 0.15 },
                strokeDashoffset: { duration: 1, repeat: Infinity, ease: 'linear' },
            }}
        />
    );
}
