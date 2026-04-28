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

function getBezierPath(sx: number, sy: number, tx: number, ty: number, type: EdgeType = 'relates_to') {
    let fromX, fromY, toX, toY, cpFromX, cpFromY, cpToX, cpToY;
    const dx = tx - sx, dy = ty - sy;
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) { fromX = sx + CARD_WIDTH; fromY = sy + CARD_HEIGHT / 2; toX = tx; toY = ty + CARD_HEIGHT / 2; }
        else         { fromX = sx; fromY = sy + CARD_HEIGHT / 2; toX = tx + CARD_WIDTH; toY = ty + CARD_HEIGHT / 2; }
        let cpOffset = Math.min(Math.abs(fromX - toX) * 0.4, 120);
        if (type === 'contradicts') cpOffset = 20;
        cpFromX = fromX + (toX > fromX ? cpOffset : -cpOffset); cpFromY = fromY;
        cpToX   = toX   + (toX > fromX ? -cpOffset : cpOffset); cpToY   = toY;
    } else {
        if (dy > 0) { fromX = sx + CARD_WIDTH / 2; fromY = sy + CARD_HEIGHT; toX = tx + CARD_WIDTH / 2; toY = ty; }
        else         { fromX = sx + CARD_WIDTH / 2; fromY = sy; toX = tx + CARD_WIDTH / 2; toY = ty + CARD_HEIGHT; }
        let cpOffset = Math.min(Math.abs(fromY - toY) * 0.4, 120);
        if (type === 'contradicts') cpOffset = 20;
        cpFromX = fromX; cpFromY = fromY + (toY > fromY ? cpOffset : -cpOffset);
        cpToX   = toX;   cpToY   = toY   + (toY > fromY ? -cpOffset : cpOffset);
    }
    return { path: `M ${fromX} ${fromY} C ${cpFromX} ${cpFromY}, ${cpToX} ${cpToY}, ${toX} ${toY}`, midX: (fromX + toX) / 2, midY: (fromY + toY) / 2 };
}

export const EdgeLine = memo(function EdgeLine({ edge, sourcePos, targetPos, onDelete, dimmed = false }: EdgeLineProps) {
    const [hovered, setHovered] = useState(false);
    const type = edge.type || 'relates_to';
    const config = EDGE_TYPES[type];
    const { path, midX, midY } = getBezierPath(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y, type);

    return (
        <g
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ cursor: hovered ? 'pointer' : 'default', opacity: dimmed ? 0.2 : 1, transition: 'opacity 0.3s ease' }}
        >
            {/* Hit area */}
            <path d={path} fill="none" stroke="transparent" strokeWidth={20} style={{ pointerEvents: 'auto' }} />

            {/* Glow layer */}
            {(hovered || type === 'inspired_by') && (
                <motion.path d={path} fill="none" stroke={config.glowColor} strokeWidth={hovered ? 14 : 10}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            )}

            {/* Main line */}
            <motion.path
                d={path}
                fill="none"
                stroke={hovered ? config.color : config.strokeColor}
                strokeWidth={hovered ? 2.5 : 1.5}
                strokeDasharray={config.dashArray !== '0' ? config.dashArray : undefined}
                initial={false}
                animate={{ strokeDashoffset: config.dashArray !== '0' ? [0, -18] : 0 }}
                transition={{ strokeDashoffset: { duration: 2.5, repeat: Infinity, ease: 'linear' } }}
            />

            {/* Label on hover */}
            {hovered && (
                <foreignObject x={midX - 56} y={midY - 14} width="112" height="20" className="pointer-events-none">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{
                            background: 'rgba(11,15,26,0.92)',
                            border: `0.5px solid ${config.color}55`,
                            borderRadius: 999,
                            padding: '2px 10px',
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 10,
                            fontWeight: 500,
                            color: config.color,
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
                        }}>
                            {config.icon} {config.label}
                        </span>
                    </div>
                </foreignObject>
            )}

            {/* Delete button */}
            {hovered && onDelete && (
                <motion.g
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); onDelete(edge.id); }}
                >
                    <circle cx={midX} cy={midY + 16} r={10} fill="rgba(11,15,26,0.92)" stroke="rgba(239,68,68,0.5)" strokeWidth={1.5} />
                    <line x1={midX - 3} y1={midY + 13} x2={midX + 3} y2={midY + 19} stroke="#EF4444" strokeWidth={1.2} />
                    <line x1={midX + 3} y1={midY + 13} x2={midX - 3} y2={midY + 19} stroke="#EF4444" strokeWidth={1.2} />
                </motion.g>
            )}
        </g>
    );
});

// ── Draft edge while connecting ──────────────────────────────────────────────
interface DraftEdgeLineProps {
    fromPos: { x: number; y: number };
    toPos: { x: number; y: number };
}

export function DraftEdgeLine({ fromPos, toPos }: DraftEdgeLineProps) {
    const dx = toPos.x - fromPos.x, dy = toPos.y - fromPos.y;
    let cpFromX = fromPos.x, cpFromY = fromPos.y, cpToX = toPos.x, cpToY = toPos.y;
    if (Math.abs(dx) > Math.abs(dy)) {
        const o = Math.min(Math.abs(dx) * 0.4, 100);
        cpFromX += (dx > 0 ? o : -o); cpToX += (dx > 0 ? -o : o);
    } else {
        const o = Math.min(Math.abs(dy) * 0.4, 100);
        cpFromY += (dy > 0 ? o : -o); cpToY += (dy > 0 ? -o : o);
    }
    const path = `M ${fromPos.x} ${fromPos.y} C ${cpFromX} ${cpFromY}, ${cpToX} ${cpToY}, ${toPos.x} ${toPos.y}`;

    return (
        <motion.path
            d={path}
            fill="none"
            stroke="rgba(0,210,200,0.55)"
            strokeWidth={2}
            strokeDasharray="8 4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, strokeDashoffset: [0, -24] }}
            transition={{ opacity: { duration: 0.15 }, strokeDashoffset: { duration: 1, repeat: Infinity, ease: 'linear' } }}
        />
    );
}
