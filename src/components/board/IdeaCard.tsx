import { motion } from 'framer-motion';
import { Tag, Sparkles } from 'lucide-react';

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
}

export function IdeaCard({ idea }: IdeaCardProps) {
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
                    defaultValue={idea.title}
                    className="bg-transparent border-none outline-none text-purple-100 font-semibold w-full"
                />
                <Sparkles className="w-4 h-4 text-purple-400 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            <textarea
                defaultValue={idea.content}
                className="w-full bg-transparent border-none outline-none text-gray-300 text-sm resize-none h-20"
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
