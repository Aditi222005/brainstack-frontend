import { motion } from "framer-motion";
import { Link } from "lucide-react";

const easeOutQuint = [0.22, 1, 0.36, 1] as const;

const LandingVisualBoard = () => {
    return (
        <section id="visual-board" className="py-32 relative overflow-hidden bg-background">
            {/* Soft Ambient Backgrounds */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(59, 130, 246, 0.05) 40px, rgba(59, 130, 246, 0.05) 41px)" }} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: easeOutQuint }}
                className="max-w-7xl mx-auto px-6 relative z-10 text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-[800] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/50 mb-6">
                    See the big picture.
                </h2>
                <p className="text-white/50 text-xl font-light max-w-2xl mx-auto leading-relaxed">
                    Connect your ideas intuitively on a vast infinite canvas, visualizing relationships in a dynamically networked ecosystem.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1.2, ease: easeOutQuint }}
                className="max-w-5xl mx-auto px-6 w-full perspective-[2000px]"
            >
                <motion.div
                    whileHover={{ rotateX: 2, rotateY: -2 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative transform-style-3d"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:30px_30px] rounded-2xl pointer-events-none" />
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none" />

                    <div className="aspect-[16/9] rounded-xl overflow-hidden relative border border-white/5 bg-[#0D0D11] p-10 flex flex-col">

                        {/* Mock Toolbar */}
                        <div className="absolute top-4 left-4 right-4 h-12 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-md flex items-center px-6 pointer-events-none">
                            <div className="w-3 h-3 rounded-full bg-red-500/50 mr-2" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50 mr-2" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50 mr-6" />
                            <div className="h-4 w-32 bg-white/5 rounded-full" />
                        </div>

                        {/* Mind Map Mockup Elements */}
                        <div className="flex-1 relative mt-12">
                            <motion.div
                                drag
                                dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                dragElastic={0.1}
                                initial={{ y: 50, x: -100, opacity: 0 }}
                                animate={{ y: 80, x: 200, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.2, ease: easeOutQuint }}
                                whileHover={{ scale: 1.05 }}
                                className="absolute p-5 w-56 bg-white/[0.05] border border-white/10 hover:border-primary/50 rounded-2xl backdrop-blur-xl cursor-grab active:cursor-grabbing z-20 transition-colors shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 hover:opacity-100 transition-opacity rounded-2xl" />
                                <h4 className="font-semibold text-white/90 text-sm mb-2 relative z-10">Central Node</h4>
                                <div className="w-full h-1.5 bg-primary/40 rounded-full mb-2 relative z-10" />
                                <p className="text-xs text-white/50 relative z-10 font-light">Core idea generation & mapping.</p>
                            </motion.div>

                            <motion.div
                                drag
                                dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                dragElastic={0.1}
                                initial={{ y: 150, x: -50, opacity: 0 }}
                                animate={{ y: -20, x: 500, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.4, ease: easeOutQuint }}
                                whileHover={{ scale: 1.05 }}
                                className="absolute p-5 w-60 bg-white/[0.05] border border-white/10 hover:border-blue-500/50 rounded-2xl backdrop-blur-xl cursor-grab active:cursor-grabbing z-20 shadow-2xl transition-colors"
                            >
                                <h4 className="font-semibold text-white/90 text-sm mb-2 flex items-center gap-2">
                                    <Link className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300" /> Connected Branch
                                </h4>
                                <div className="w-4/5 h-1.5 bg-blue-500/40 rounded-full mb-2" />
                                <p className="text-xs text-white/50 font-light">Synthesizing relationships.</p>
                            </motion.div>

                            <motion.div
                                drag
                                dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                dragElastic={0.1}
                                initial={{ y: 50, x: 400, opacity: 0 }}
                                animate={{ y: 200, x: 450, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.6, ease: easeOutQuint }}
                                whileHover={{ scale: 1.05 }}
                                className="absolute p-5 w-52 bg-white/[0.05] border border-white/10 hover:border-purple-500/50 rounded-2xl backdrop-blur-xl cursor-grab active:cursor-grabbing z-20 shadow-2xl transition-colors"
                            >
                                <h4 className="font-semibold text-white/90 text-sm mb-2">Deep Discovery</h4>
                                <div className="w-full h-1.5 bg-purple-500/40 rounded-full mb-2" />
                                <div className="w-2/3 h-1.5 bg-white/10 rounded-full mb-2" />
                                <p className="text-xs text-white/50 font-light">Further exploration paths.</p>
                            </motion.div>

                            {/* Connecting lines SVG */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-50">
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 2, ease: easeOutQuint, delay: 0.5 }}
                                    d="M 320 120 C 400 120, 450 30, 520 30"
                                    stroke="url(#gradientBoard1)"
                                    strokeWidth="2.5"
                                    fill="none"
                                />
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 2, ease: easeOutQuint, delay: 0.8 }}
                                    d="M 320 150 C 400 150, 450 250, 490 250"
                                    stroke="url(#gradientBoard2)"
                                    strokeWidth="2.5"
                                    fill="none"
                                    strokeDasharray="6 6"
                                />
                                <defs>
                                    <linearGradient id="gradientBoard1" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="hsl(263, 70%, 58%)" />
                                        <stop offset="100%" stopColor="hsl(217, 91%, 60%)" />
                                    </linearGradient>
                                    <linearGradient id="gradientBoard2" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="hsl(263, 70%, 58%)" />
                                        <stop offset="100%" stopColor="hsl(280, 80%, 45%)" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default LandingVisualBoard;
