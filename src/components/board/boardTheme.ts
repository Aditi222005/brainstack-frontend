// ─── Node Color System ───
export type NodeColor = 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'orange' | 'pink' | 'cyan';

export interface NodeColorConfig {
    label: string;
    border: string;
    glow: string;
    bg: string;
    text: string;
    tagBg: string;
    dot: string;
}

export const NODE_COLORS: Record<NodeColor, NodeColorConfig> = {
    blue: { label: 'General', border: 'border-[rgba(59,130,246,0.25)]', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]', bg: 'bg-[rgba(59,130,246,0.06)]', text: 'text-[#93C5FD]', tagBg: 'bg-[rgba(59,130,246,0.12)]', dot: '#3B82F6' },
    purple: { label: 'Concept', border: 'border-[rgba(124,111,255,0.30)]', glow: 'shadow-[0_0_20px_rgba(124,111,255,0.15)]', bg: 'bg-[rgba(124,111,255,0.06)]', text: 'text-[#C4B5FD]', tagBg: 'bg-[rgba(124,111,255,0.12)]', dot: '#7C6FFF' },
    green: { label: 'Completed', border: 'border-[rgba(16,185,129,0.25)]', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]', bg: 'bg-[rgba(16,185,129,0.06)]', text: 'text-[#6EE7B7]', tagBg: 'bg-[rgba(16,185,129,0.12)]', dot: '#10B981' },
    yellow: { label: 'In Progress', border: 'border-[rgba(245,158,11,0.25)]', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]', bg: 'bg-[rgba(245,158,11,0.06)]', text: 'text-[#FCD34D]', tagBg: 'bg-[rgba(245,158,11,0.12)]', dot: '#F59E0B' },
    red: { label: 'Critical', border: 'border-[rgba(239,68,68,0.25)]', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]', bg: 'bg-[rgba(239,68,68,0.06)]', text: 'text-[#FCA5A5]', tagBg: 'bg-[rgba(239,68,68,0.12)]', dot: '#EF4444' },
    orange: { label: 'Example', border: 'border-[rgba(249,115,22,0.25)]', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.15)]', bg: 'bg-[rgba(249,115,22,0.06)]', text: 'text-[#FDBA74]', tagBg: 'bg-[rgba(249,115,22,0.12)]', dot: '#F97316' },
    pink: { label: 'Future', border: 'border-[rgba(236,72,153,0.25)]', glow: 'shadow-[0_0_20px_rgba(236,72,153,0.15)]', bg: 'bg-[rgba(236,72,153,0.06)]', text: 'text-[#F9A8D4]', tagBg: 'bg-[rgba(236,72,153,0.12)]', dot: '#EC4899' },
    cyan: { label: 'Research', border: 'border-[rgba(171, 225, 234, 0.25)]', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]', bg: 'bg-[rgba(6,182,212,0.06)]', text: 'text-[#67E8F9]', tagBg: 'bg-[rgba(6,182,212,0.12)]', dot: '#06B6D4' },
};

// ─── Edge Type System ───
export type EdgeType = 'relates_to' | 'depends_on' | 'contradicts' | 'inspired_by';

export interface EdgeTypeConfig {
    label: string;
    description: string;
    example: string;
    color: string;
    strokeColor: string;
    glowColor: string;
    dashArray: string;
    icon: string;
}

export const EDGE_TYPES: Record<EdgeType, EdgeTypeConfig> = {
    relates_to: { label: 'Relates To', description: 'These two ideas share a topic or theme.', example: 'e.g. "Photosynthesis" relates to "Sunlight"', color: '#7C6FFF', strokeColor: 'rgba(124,111,255,0.45)', glowColor: 'rgba(124,111,255,0.10)', dashArray: '6 3', icon: '🔗' },
    depends_on: { label: 'Needs First', description: 'You must understand the first idea before this one.', example: 'e.g. "Algebra" needs "Basic Math" first', color: '#00D2C8', strokeColor: 'rgba(0,210,200,0.55)', glowColor: 'rgba(0,210,200,0.10)', dashArray: '0', icon: '⚡' },
    contradicts: { label: 'Disagrees With', description: 'These ideas have opposing views or conflict.', example: 'e.g. "Evolution" disagrees with "Creationism"', color: '#EF4444', strokeColor: 'rgba(239,68,68,0.50)', glowColor: 'rgba(239,68,68,0.10)', dashArray: '3 3', icon: '⚔️' },
    inspired_by: { label: 'Inspired By', description: 'This idea came to life because of the other.', example: 'e.g. "Gravity" was inspired by "Falling Apple"', color: '#F97316', strokeColor: 'rgba(249,115,22,0.55)', glowColor: 'rgba(249,115,22,0.12)', dashArray: '8 4', icon: '✨' },
};

export const EDGE_TYPE_LIST: EdgeType[] = ['relates_to', 'depends_on', 'contradicts', 'inspired_by'];
