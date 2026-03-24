import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const LandingCTA = () => {
    return (
        <section className="py-32 relative overflow-hidden bg-background">
            <div className="absolute inset-0 bg-primary/5 blur-[200px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto px-6 relative z-10"
            >
                <div className="p-16 rounded-3xl bg-gradient-to-r from-primary/20 via-purple-600/20 to-primary/20 border border-white/10 backdrop-blur-md shadow-[0_0_50px_rgba(168,85,247,0.2)] text-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
     
                        Start Building Your <br className="hidden md:block" /> BrainStack Today.
                    </h2>
                    <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                        Join thousands of thinkers who have successfully extended their minds into a perfect digital workspace ecosystem.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="flex items-center gap-2 bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all transform hover:scale-105"
                        >
                            Start for Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default LandingCTA;
