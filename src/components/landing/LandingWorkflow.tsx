import { motion } from "framer-motion";
import { PenTool, BrainCircuit, Share2 } from "lucide-react";

const steps = [
    {
        icon: <PenTool className="w-10 h-10" />,
        title: "Capture Ideas",
        desc: "Seamlessly jot down notes, thoughts, and external links without switching contexts.",
    },
    {
        icon: <BrainCircuit className="w-10 h-10" />,
        title: "Connect Knowledge",
        desc: "Automatically map related thoughts using dual-linking and visual spatial canvas mapping.",
    },
    {
        icon: <Share2 className="w-10 h-10" />,
        title: "Build Your Second Brain",
        desc: "Grow an interconnected powerhouse that thinks with you effortlessly over time.",
    },
];

const easeOutQuint = [0.22, 1, 0.36, 1] as const;

const LandingWorkflow = () => {
    return (
        <section id="workflow" className="py-32 relative bg-background/50 border-y border-white/5 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(168, 85, 247, 0.05) 40px, rgba(168, 85, 247, 0.05) 41px)" }} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: easeOutQuint }}
                className="max-w-7xl mx-auto px-6 relative z-10"
            >
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-[800] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/50 mb-6">
                        A workflow that just works.
                    </h2>
                    <p className="text-white/50 text-xl font-light max-w-2xl mx-auto leading-relaxed">
                        Three simple steps to transition from scattered thoughts to a perfectly organized digital mind.
                    </p>
                </div>

                <div className="relative">
                    {/* Animated Timeline Line */}
                    <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 hidden md:block overflow-hidden h-1">
                        <div className="w-full h-px bg-white/5 absolute top-0" />
                        <motion.div
                            initial={{ x: "-100%" }}
                            whileInView={{ x: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 3, ease: easeOutQuint, delay: 0.5 }}
                            className="w-1/2 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent absolute top-0 blur-[1px]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 perspective-[1000px]">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ margin: "-50px", once: true }}
                                transition={{ delay: idx * 0.2, duration: 0.8, ease: easeOutQuint }}
                                whileHover={{ scale: 1.05, y: -10 }}
                                className="group flex flex-col items-center text-center p-8 bg-[#0D0D11] rounded-3xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-b from-white/10 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500 -z-10" />
                                <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary/20 to-purple-500/10 border border-primary/20 flex justify-center items-center text-primary mb-8 shadow-[0_0_30px_rgba(168,85,247,0.15)] group-hover:text-purple-300 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] group-hover:border-primary/50 transition-all duration-500 relative z-10">
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-semibold text-white/90 mb-4 relative z-10 group-hover:text-white transition-colors">
                                    {idx + 1}. {step.title}
                                </h3>
                                <p className="text-white/50 leading-relaxed font-light relative z-10 group-hover:text-white/70 transition-colors">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default LandingWorkflow;
