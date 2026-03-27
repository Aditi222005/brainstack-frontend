import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    MotionValue
} from "framer-motion";
import { ArrowRight, Sparkles, Wand2, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const easeOutQuint = [0.22, 1, 0.36, 1] as const;


/* ---------------- PARTICLES ---------------- */

const FloatingParticles = () => {
    const particles = new Array(20).fill(0);

    return (
        <div className="absolute inset-0 pointer-events-none">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        y: Math.random() * 800,
                        x: Math.random() * 1200,
                        opacity: 0
                    }}
                    animate={{
                        y: [null, Math.random() * -200],
                        opacity: [0, 0.8, 0]
                    }}
                    transition={{
                        duration: 6 + Math.random() * 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-primary blur-[1px]"
                />
            ))}
        </div>
    );
};


/* ---------------- GRID BACKGROUND ---------------- */

const AnimatedGrid = () => {
    return (
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary))/0.1_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary))/0.1_1px,transparent_1px)] bg-[size:40px_40px]" />

            <motion.div
                animate={{ opacity: [0.05, 0.15, 0.05] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute inset-0"
            />
        </div>
    );
};


/* ---------------- FLOATING FEATURES ---------------- */

const FloatingFeature = ({ text, className }: any) => {
    return (
        <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: [0, -15, 0], opacity: 1 }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className={`absolute px-5 py-3 rounded-xl bg-card/60 border border-border backdrop-blur-md text-foreground/80 text-sm shadow-xl ${className}`}
        >
            {text}
        </motion.div>
    );
};


/* ---------------- KNOWLEDGE NODES ---------------- */

const KnowledgeNode = ({ x, y }: any) => {
    return (
        <motion.div
            style={{ left: x, top: y }}
            animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6]
            }}
            transition={{
                duration: 3,
                repeat: Infinity
            }}
            className="absolute w-3 h-3 bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary))]"
        />
    );
};


/* ---------------- MAGNETIC BUTTON ---------------- */

const MagneticButton = ({ children, className, ...props }: any) => {
    const ref = useRef<HTMLAnchorElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const ySpring = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!ref.current) return;

        const { clientX, clientY } = e;

        const { height, width, left, top } =
            ref.current.getBoundingClientRect();

        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        x.set(middleX * 0.2);
        y.set(middleY * 0.2);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div style={{ x: xSpring, y: ySpring }}>
            <Link
                ref={ref}
                onMouseMove={handleMouse}
                onMouseLeave={reset}
                className={className}
                {...props}
            >
                {children}
            </Link>
        </motion.div>
    );
};


/* ---------------- HERO DASHBOARD ---------------- */

interface DashboardProps {
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
}

const HeroDashboardPreview = ({ mouseX, mouseY }: DashboardProps) => {
    const springX = useSpring(mouseX, { damping: 30, stiffness: 200 });
    const springY = useSpring(mouseY, { damping: 30, stiffness: 200 });

    const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

    const [text, setText] = useState("");

    const fullText =
        "Summarize the cognitive science literature...";

    useEffect(() => {
        let i = 0;

        const timer = setInterval(() => {
            setText(fullText.slice(0, i));
            i++;

            if (i > fullText.length) clearInterval(timer);
        }, 50);

        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="relative z-10 mt-28 max-w-6xl mx-auto px-6 w-full"
        >
            <motion.div
                style={{ rotateX, rotateY }}
                className="rounded-xl border border-border bg-card/40 backdrop-blur-xl p-1 shadow-2xl shadow-primary/5"
            >
                <div className="rounded-lg overflow-hidden bg-background aspect-[16/10] flex flex-col">

                    <div className="h-14 border-b border-border flex items-center px-6 justify-center">

                        <div className="max-w-md w-full h-8 bg-primary/5 rounded-full border border-border flex items-center px-4">

                            <Wand2 className="w-4 h-4 text-secondary mr-2" />

                            <span className="text-sm text-foreground/50 font-mono">
                                {text}
                            </span>

                        </div>
                    </div>


                    <div className="flex-1 p-10 relative">

                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 6 }}
                            className="absolute top-[30%] left-[20%] w-56 p-5 bg-primary/5 border border-primary/10 rounded-xl"
                        >
                            <div className="text-foreground text-sm mb-3">
                                AI Research
                            </div>

                            <div className="w-full h-2 bg-primary/40 rounded mb-2" />

                            <div className="w-3/4 h-2 bg-foreground/10 rounded" />
                        </motion.div>


                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ repeat: Infinity, duration: 7 }}
                            className="absolute bottom-[25%] right-[25%] w-60 p-5 bg-secondary/5 border border-secondary/10 rounded-xl"
                        >
                            <div className="text-foreground text-sm mb-3">
                                Cognitive Models
                            </div>

                            <div className="w-full h-2 bg-secondary/40 rounded mb-2" />

                            <div className="w-4/5 h-2 bg-foreground/10 rounded" />
                        </motion.div>

                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};


/* ---------------- MAIN HERO ---------------- */

const LandingHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouse = (e: any) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        mouseX.set(x);
        mouseY.set(y);
    };

    const reset = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-32"
        >

            <AnimatedGrid />
            <FloatingParticles />

            <KnowledgeNode x="30%" y="40%" />
            <KnowledgeNode x="70%" y="50%" />
            <KnowledgeNode x="55%" y="30%" />


            <FloatingFeature
                text="AI Auto Summaries"
                className="top-[15%] right-[10%]"
            />

            <FloatingFeature
                text="Smart Knowledge Graph"
                className="bottom-[20%] left-[12%]"
            />

            <FloatingFeature
                text="Instant Idea Capture"
                className="top-[50%] right-[5%]"
            />


            <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative z-10 max-w-4xl mx-auto px-6 text-center"
            >

                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm mb-8 text-primary">

                    <Sparkles className="w-4 h-4 animate-pulse" />

                    <span>
                        The absolute future of knowledge management
                    </span>

                </div>


                <h1 className="text-6xl md:text-[5rem] font-[800] tracking-tight text-foreground mb-6 leading-[1.1]">

                    Build Your Second Brain

                    <br />

                    <span className="text-gradient">

                        with BrainStack

                    </span>

                </h1>


                <p className="text-lg md:text-2xl text-foreground/60 mb-12 max-w-2xl mx-auto">

                    Capture ideas instantly, organize knowledge organically,
                    and visualize every connection in a deeply intelligent
                    workspace.

                </p>


                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">

                    {isLoggedIn ? (
                        <MagneticButton
                            to="/ai-board"
                            className="flex items-center gap-2 btn-gradient-accent text-white px-10 py-5 rounded-full font-semibold shadow-xl hover:shadow-secondary/30 transition-shadow"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Go to Dashboard
                        </MagneticButton>
                    ) : (
                        <MagneticButton
                            to="/signup"
                            className="flex items-center gap-2 btn-gradient-accent text-white px-10 py-5 rounded-full font-semibold shadow-xl hover:shadow-secondary/30 transition-shadow"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </MagneticButton>
                    )}

                    <a
                        href="#visual-board"
                        className="flex items-center gap-2 bg-card/60 border border-border text-foreground px-10 py-5 rounded-full font-semibold hover:bg-card/80 hover:border-primary/30 transition-all shadow-lg"
                    >
                        View Demo
                    </a>

                </div>


                {/* Stats */}

                <div className="flex justify-center gap-12 mt-10">

                    <div>
                        <p className="text-3xl font-bold text-foreground">
                            10k+
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Ideas Captured
                        </p>
                    </div>

                    <div>
                        <p className="text-3xl font-bold text-foreground">
                            2k+
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Active Thinkers
                        </p>
                    </div>

                    <div>
                        <p className="text-3xl font-bold text-foreground">
                            95%
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Faster Learning
                        </p>
                    </div>

                </div>

            </motion.div>


            <HeroDashboardPreview mouseX={mouseX} mouseY={mouseY} />

        </section>
    );
};

export default LandingHero;