import { motion } from "framer-motion";
import { LayoutDashboard, FileText, Share2, Sparkles, Tags, Search } from "lucide-react";

const features = [
    {
        icon: <LayoutDashboard className="w-8 h-8" />,
        title: "Visual Boards",
        description: "Map out your ideas on a vast infinite canvas, visually linking knowledge perfectly.",
    },
    {
        icon: <FileText className="w-8 h-8" />,
        title: "Smart Notes",
        description: "Format and embed any content easily into a highly intuitive rich-text environment.",
    },
    {
        icon: <Share2 className="w-8 h-8" />,
        title: "Knowledge Graph",
        description: "Understand the hidden relationships between notes through automated deep linking.",
    },
    {
        icon: <Sparkles className="w-8 h-8" />,
        title: "AI Suggestions",
        description: "Let AI synthesize and suggest insights based on your existing workspace history.",
    },
    {
        icon: <Tags className="w-8 h-8" />,
        title: "Tag & Link System",
        description: "Build robust networked systems easily mapping diverse information instantly.",
    },
    {
        icon: <Search className="w-8 h-8" />,
        title: "Quick Search",
        description: "Instantly retrieve your second brain documents seamlessly anywhere via spotlight.",
    },
];

const easeOutQuint = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.8, ease: easeOutQuint }
    }
};

const LandingFeatures = () => {
    return (
        <section id="features" className="py-32 relative bg-background/50 border-t border-b border-white/5 overflow-hidden">
            {/* Speed line ambient bg */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "repeating-linear-gradient(transparent, transparent 40px, rgba(168, 85, 247, 0.05) 40px, rgba(168, 85, 247, 0.05) 41px)" }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: easeOutQuint }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-[800] bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-blue-400 mb-6 tracking-tight">
                        Everything you need.
                    </h2>
                    <p className="text-white/50 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        A comprehensive suite of tools built to extend your mind, seamlessly connected in a unified intelligent workspace.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ scale: 1.04, y: -5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="group p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-transparent transition-all duration-500 backdrop-blur-xl shadow-lg relative overflow-hidden"
                        >
                            {/* Hover Neon Edge Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                            {/* Border gradient trick */}
                            <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-100 group-hover:opacity-0 transition-opacity duration-500 -z-10" />
                            <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-primary/50 via-purple-500/0 to-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                            <div className="relative z-10">
                                <div className="text-white/60 mb-6 group-hover:text-primary group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-semibold text-white/90 mb-3 group-hover:text-white transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-white/50 leading-relaxed font-light group-hover:text-white/70 transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default LandingFeatures;
