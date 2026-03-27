import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, LayoutDashboard, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const LandingNavbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (token) {
            setIsLoggedIn(true);
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setUserName(user.name || "");
                } catch { }
            }
        }
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout failed", error);
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserName("");
        navigate("/login");
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-background/80 backdrop-blur-md border-b border-border py-3 shadow-lg shadow-black/5 dark:shadow-black/20"
                : "bg-transparent py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/0 p-2 rounded-xl group-hover:bg-primary/25 transition-colors">
                        <img src="/favicon.png" alt="BrainStack" className="w-20 h-15 text-primary" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        BrainStack
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                    <a href="#visual-board" className="hover:text-foreground transition-colors">Visual Boards</a>
                    <a href="#workflow" className="hover:text-foreground transition-colors">Workflow</a>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/ai-board"
                                className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full btn-gradient-accent text-white hover:shadow-[0_0_25px_hsl(var(--primary)/0.4)] transition-all"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-sm font-medium text-destructive/60 hover:text-destructive transition-colors px-3 py-2.5"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="text-sm font-medium px-5 py-2.5 rounded-full btn-gradient-accent text-white hover:shadow-[0_0_25px_hsl(var(--primary)/0.4)] transition-all"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default LandingNavbar;
