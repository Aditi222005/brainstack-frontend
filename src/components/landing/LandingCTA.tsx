import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";

const LandingCTA = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    return (
        <section className="py-32 relative overflow-hidden bg-[#0B0F19]">
            <div className="absolute inset-0 bg-indigo-500/5 blur-[200px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto px-6 relative z-10"
            >
                <div className="p-16 rounded-3xl bg-gradient-to-r from-indigo-500/15 via-indigo-600/10 to-cyan-500/15 border border-indigo-500/15 backdrop-blur-md shadow-[0_0_50px_rgba(99,102,241,0.15)] text-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-[#E5E7EB] mb-6">
     
                        Start Building Your <br className="hidden md:block" /> BrainStack Today.
                    </h2>
                    <p className="text-xl text-[#E5E7EB]/60 mb-10 max-w-2xl mx-auto">
                        Join thousands of thinkers who have successfully extended their minds into a perfect digital workspace ecosystem.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {isLoggedIn ? (
                            <Link
                                to="/ai-board"
                                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all transform hover:scale-105"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/signup"
                                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all transform hover:scale-105"
                            >
                                Start for Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        )}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default LandingCTA;
