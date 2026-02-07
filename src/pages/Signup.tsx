import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Lock, Sparkles } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import GoogleButton from "@/components/auth/GoogleButton";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Signup logic will be added with backend
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <GoogleButton label="Sign up with Google" delay={0.2} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center gap-3 py-2"
        >
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">
            Or, sign up with your email
          </span>
          <div className="flex-1 h-px bg-border" />
        </motion.div>

        <AuthInput
          icon={User}
          placeholder="Name / nickname"
          value={name}
          onChange={setName}
          delay={0.35}
        />

        <AuthInput
          icon={Mail}
          placeholder="Email"
          type="email"
          value={email}
          onChange={setEmail}
          delay={0.4}
        />

        <AuthInput
          icon={Phone}
          placeholder="Phone number"
          type="tel"
          value={phone}
          onChange={setPhone}
          delay={0.45}
        />

        <AuthInput
          icon={Lock}
          placeholder="Password"
          type="password"
          value={password}
          onChange={setPassword}
          delay={0.5}
        />

        <AuthInput
          icon={Lock}
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          delay={0.55}
        />

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-lg btn-gradient px-6 py-3.5 text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
        >
          <Sparkles className="h-4 w-4" />
          Continue
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="flex items-start gap-3 pt-1"
        >
          <button
            type="button"
            onClick={() => setAgreed(!agreed)}
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all duration-200 ${
              agreed
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/50"
            }`}
          >
            {agreed && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="h-3 w-3"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2 6L5 9L10 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </button>
          <span className="text-sm text-muted-foreground">
            I agree to the{" "}
            <a
              href="#"
              className="text-foreground underline decoration-primary/50 underline-offset-2 hover:decoration-primary transition-colors duration-200"
            >
              terms and conditions
            </a>
          </span>
        </motion.div>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.4 }}
        className="mt-8 text-center text-sm text-muted-foreground"
      >
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-foreground font-medium underline decoration-primary/50 underline-offset-2 hover:decoration-primary transition-colors duration-200"
        >
          Sign in
        </Link>
      </motion.p>
    </AuthLayout>
  );
};

export default Signup;
