import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

const LandingNavbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-background/80 backdrop-blur-md border-b border-white/10 py-3 shadow-lg"
                : "bg-transparent py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
                        <BrainCircuit className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        BrainStack
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#visual-board" className="hover:text-white transition-colors">Visual Boards</a>
                    <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
                        Log in
                    </Link>
                    <Link
                        to="/signup"
                        className="text-sm font-medium px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};

export default LandingNavbar;
