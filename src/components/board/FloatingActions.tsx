import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Layers, DownloadCloud } from 'lucide-react';
import { useState } from 'react';

export function FloatingActions({ onAddIdea }: { onAddIdea?: () => void }) {
    const [expanded, setExpanded] = useState(false);

    const actionItems = [
        {
            label: 'Add Idea',
            onClick: onAddIdea,
            color: 'rgba(124,111,255,0.15)',
            borderColor: 'rgba(124,111,255,0.25)',
            iconColor: '#7C6FFF',
            icon: <Plus style={{ width: 16, height: 16 }} />,
        },
        {
            label: 'Add Group',
            onClick: undefined,
            color: 'rgba(0,210,200,0.1)',
            borderColor: 'rgba(0,210,200,0.2)',
            iconColor: '#00D2C8',
            icon: <Layers style={{ width: 16, height: 16 }} />,
        },
        {
            label: 'Import Notes',
            onClick: undefined,
            color: 'rgba(249,115,22,0.1)',
            borderColor: 'rgba(249,115,22,0.2)',
            iconColor: '#F97316',
            icon: <DownloadCloud style={{ width: 16, height: 16 }} />,
        },
    ];

    return (
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 4 }}
                    >
                        {actionItems.map((item, i) => (
                            <motion.button
                                key={item.label}
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                onClick={item.onClick}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    background: 'rgba(11,15,26,0.92)',
                                    backdropFilter: 'blur(12px)',
                                    WebkitBackdropFilter: 'blur(12px)',
                                    border: `0.5px solid ${item.borderColor}`,
                                    borderRadius: 999,
                                    padding: '9px 16px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                                    transition: 'border-color 0.2s, background 0.2s',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = item.color; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(11,15,26,0.92)'; }}
                            >
                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: 'rgba(232,234,240,0.8)' }}>
                                    {item.label}
                                </span>
                                <div style={{ background: item.color, borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.iconColor, flexShrink: 0 }}>
                                    {item.icon}
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB button */}
            <button
                onClick={() => setExpanded(!expanded)}
                style={{
                    width: 56, height: 56,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: expanded
                        ? '0 0 32px rgba(124,111,255,0.7)'
                        : '0 0 20px rgba(124,111,255,0.4)',
                    transition: 'box-shadow 0.25s ease, transform 0.2s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            >
                <motion.div
                    animate={{ rotate: expanded ? 45 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                    <Plus style={{ width: 26, height: 26, color: '#fff' }} />
                </motion.div>
            </button>
        </div>
    );
}
