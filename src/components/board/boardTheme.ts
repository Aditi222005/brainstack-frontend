// ─── Node Color System ───
export type NodeColor = 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'orange' | 'pink';

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
    blue: {
        label: 'General',
        border: 'border-blue-500/30',
        glow: 'shadow-[0_0_20px_rgba(59,130,246,0.25)]',
        bg: 'bg-blue-500/10',
        text: 'text-blue-300',
        tagBg: 'bg-blue-900/40',
        dot: '#3B82F6',
    },
    purple: {
        label: 'Concept',
        border: 'border-purple-500/30',
        glow: 'shadow-[0_0_20px_rgba(168,85,247,0.25)]',
        bg: 'bg-purple-500/10',
        text: 'text-purple-300',
        tagBg: 'bg-purple-900/40',
        dot: '#A855F7',
    },
    green: {
        label: 'Completed',
        border: 'border-emerald-500/30',
        glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-300',
        tagBg: 'bg-emerald-900/40',
        dot: '#10B981',
    },
    yellow: {
        label: 'In Progress',
        border: 'border-amber-500/30',
        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
        bg: 'bg-amber-500/10',
        text: 'text-amber-300',
        tagBg: 'bg-amber-900/40',
        dot: '#F59E0B',
    },
    red: {
        label: 'Critical',
        border: 'border-red-500/30',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.25)]',
        bg: 'bg-red-500/10',
        text: 'text-red-300',
        tagBg: 'bg-red-900/40',
        dot: '#EF4444',
    },
    orange: {
        label: 'Example',
        border: 'border-orange-500/30',
        glow: 'shadow-[0_0_20px_rgba(249,115,22,0.25)]',
        bg: 'bg-orange-500/10',
        text: 'text-orange-300',
        tagBg: 'bg-orange-900/40',
        dot: '#F97316',
    },
    pink: {
        label: 'Future',
        border: 'border-pink-500/30',
        glow: 'shadow-[0_0_20px_rgba(236,72,153,0.25)]',
        bg: 'bg-pink-500/10',
        text: 'text-pink-300',
        tagBg: 'bg-pink-900/40',
        dot: '#EC4899',
    },
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
    relates_to: {
        label: 'Relates To',
        description: 'These two ideas share a topic or theme.',
        example: 'e.g. "Photosynthesis" relates to "Sunlight"',
        color: '#6366F1',
        strokeColor: 'rgba(99, 102, 241, 0.5)',
        glowColor: 'rgba(99, 102, 241, 0.15)',
        dashArray: '6 3',
        icon: '🔗',
    },
    depends_on: {
        label: 'Needs First',
        description: 'You must understand the first idea before this one.',
        example: 'e.g. "Algebra" needs "Basic Math" first',
        color: '#F59E0B',
        strokeColor: 'rgba(245, 158, 11, 0.7)',
        glowColor: 'rgba(245, 158, 11, 0.15)',
        dashArray: '0', // solid
        icon: '⚡',
    },
    contradicts: {
        label: 'Disagrees With',
        description: 'These ideas have opposing views or conflict.',
        example: 'e.g. "Evolution" disagrees with "Creationism"',
        color: '#EF4444',
        strokeColor: 'rgba(239, 68, 68, 0.6)',
        glowColor: 'rgba(239, 68, 68, 0.15)',
        dashArray: '3 3',
        icon: '⚔️',
    },
    inspired_by: {
        label: 'Inspired By',
        description: 'This idea came to life because of the other.',
        example: 'e.g. "Gravity" was inspired by "Falling Apple"',
        color: '#A855F7',
        strokeColor: 'rgba(168, 85, 247, 0.6)',
        glowColor: 'rgba(168, 85, 247, 0.2)',
        dashArray: '8 4',
        icon: '✨',
    },
};

export const EDGE_TYPE_LIST: EdgeType[] = ['relates_to', 'depends_on', 'contradicts', 'inspired_by'];
