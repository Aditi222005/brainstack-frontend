import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import GoogleButton from "@/components/auth/GoogleButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        navigate("/ai-board");
      } else {
        setError(data.message || "Failed to login");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg text-center"
          >
            {error}
          </motion.div>
        )}
        <GoogleButton label="Sign in with Google" delay={0.2} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center gap-3 py-2"
        >
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">
            Or, sign in with your email
          </span>
          <div className="flex-1 h-px bg-border" />
        </motion.div>

        <AuthInput
          icon={Mail}
          placeholder="Email"
          type="email"
          value={email}
          onChange={setEmail}
          delay={0.35}
        />

        <AuthInput
          icon={Lock}
          placeholder="Password"
          type="password"
          value={password}
          onChange={setPassword}
          delay={0.4}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="flex justify-end"
        >
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
          >
            Forgot password?
          </a>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg btn-gradient px-6 py-3.5 text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-8 text-center text-sm text-muted-foreground"
      >
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-foreground font-medium underline decoration-primary/50 underline-offset-2 hover:decoration-primary transition-colors duration-200"
        >
          Sign up
        </Link>
      </motion.p>
    </AuthLayout>
  );
};

export default Login;
