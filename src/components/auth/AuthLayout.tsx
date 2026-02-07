import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      {/* Animated background glow */}
      <div className="auth-gradient-bg absolute inset-0" />
      
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(263 70% 58% / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(263 70% 58% / 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -30, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="relative">
            <Brain className="h-10 w-10 text-primary" />
            <div className="absolute inset-0 h-10 w-10 text-primary blur-lg opacity-50 animate-glow-pulse">
              <Brain className="h-10 w-10" />
            </div>
          </div>
          <span className="text-2xl font-bold text-foreground tracking-tight">
            SecondBrain
          </span>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl p-8 glow-border"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
