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
    left:   { left: -7,  top: '50%', transform: 'translateY(-50%)' },
    right:  { right: -7, top: '50%', transform: 'translateY(-50%)' },
    top:    { top: -7,   left: '50%', transform: 'translateX(-50%)' },
    bottom: { bottom: -7, left: '50%', transform: 'translateX(-50%)' },
};

export const ConnectionHandle = memo(function ConnectionHandle({
    nodeId, side, onConnectionStart, onConnectionEnd, isConnecting, isValidTarget,
}: ConnectionHandleProps) {
    const handleRef = useRef<HTMLDivElement>(null);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        e.stopPropagation(); e.preventDefault();
        onConnectionStart(nodeId, side, e);
    }, [nodeId, side, onConnectionStart]);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        e.stopPropagation(); e.preventDefault();
        if (isConnecting && isValidTarget) onConnectionEnd(nodeId);
    }, [nodeId, isConnecting, isValidTarget, onConnectionEnd]);

    const activeTarget = isConnecting && isValidTarget;

    return (
        <motion.div
            ref={handleRef}
            style={{
                position: 'absolute',
                zIndex: 50,
                borderRadius: '50%',
                cursor: isConnecting ? (isValidTarget ? 'cell' : 'not-allowed') : 'crosshair',
                ...(activeTarget
                    ? {
                        width: 20, height: 20,
                        background: 'var(--color-secondary)',
                        border: '2px solid rgba(0,210,200,0.7)',
                        boxShadow: '0 0 14px rgba(0,210,200,0.7)',
                        margin: '-4px',
                    }
                    : {
                        width: 12, height: 12,
                        background: 'rgba(124,111,255,0.5)',
                        border: '1.5px solid rgba(124,111,255,0.3)',
                        opacity: 0,
                        transition: 'opacity 0.2s, transform 0.15s',
                    }),
                ...POSITIONS[side],
            }}
            className={!activeTarget ? 'group-hover:!opacity-100 hover:!opacity-100' : ''}
            onPointerDown={!isConnecting ? handlePointerDown : undefined}
            onPointerUp={activeTarget ? handlePointerUp : undefined}
            initial={false}
            whileHover={activeTarget ? { scale: 1.55 } : { scale: 1.3, opacity: 1 }}
            animate={activeTarget
                ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 1.2 } }
                : {}}
        />
    );
});
