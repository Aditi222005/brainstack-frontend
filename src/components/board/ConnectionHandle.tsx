import { motion } from 'framer-motion';
import { useCallback, useRef, memo } from 'react';

interface ConnectionHandleProps {
    nodeId: string;
    side: 'left' | 'right' | 'top' | 'bottom';
    onConnectionStart: (nodeId: string, side: string, e: React.PointerEvent) => void;
    onConnectionEnd: (nodeId: string) => void;
    isConnecting: boolean;
    isValidTarget: boolean;
}

const POSITIONS: Record<string, React.CSSProperties> = {
    left: { left: -6, top: '50%', transform: 'translateY(-50%)' },
    right: { right: -6, top: '50%', transform: 'translateY(-50%)' },
    top: { top: -6, left: '50%', transform: 'translateX(-50%)' },
    bottom: { bottom: -6, left: '50%', transform: 'translateX(-50%)' },
};

export const ConnectionHandle = memo(function ConnectionHandle({
    nodeId,
    side,
    onConnectionStart,
    onConnectionEnd,
    isConnecting,
    isValidTarget,
}: ConnectionHandleProps) {
    const handleRef = useRef<HTMLDivElement>(null);

    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            e.stopPropagation();
            e.preventDefault();
            onConnectionStart(nodeId, side, e);
        },
        [nodeId, side, onConnectionStart]
    );

    const handlePointerUp = useCallback(
        (e: React.PointerEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (isConnecting && isValidTarget) {
                onConnectionEnd(nodeId);
            }
        },
        [nodeId, isConnecting, isValidTarget, onConnectionEnd]
    );

    return (
        <motion.div
            ref={handleRef}
            className={`absolute z-50 rounded-full border-2 transition-all duration-200
                ${isConnecting && isValidTarget
                    ? 'w-5 h-5 bg-cyan-400 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                    : 'w-3 h-3 bg-indigo-500/60 border-indigo-400/40 opacity-0 group-hover:opacity-100 hover:!opacity-100 hover:bg-cyan-400 hover:border-cyan-300 hover:scale-125 hover:shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                }`}
            style={{
                ...POSITIONS[side],
                cursor: isConnecting ? (isValidTarget ? 'cell' : 'not-allowed') : 'crosshair',
                ...(isConnecting && isValidTarget ? { margin: '-4px' } : {}),
            }}
            onPointerDown={!isConnecting ? handlePointerDown : undefined}
            onPointerUp={isConnecting && isValidTarget ? handlePointerUp : undefined}
            initial={false}
            whileHover={isConnecting && isValidTarget ? { scale: 1.6 } : { scale: 1.3 }}
        />
    );
});
