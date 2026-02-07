import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AuthInputProps {
  icon: LucideIcon;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  delay?: number;
}

const AuthInput = ({
  icon: Icon,
  placeholder,
  type = "text",
  value,
  onChange,
  delay = 0,
}: AuthInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative group"
    >
      <div className="flex items-center rounded-lg border border-border bg-card/50 px-4 py-3 input-glow transition-all duration-300 hover:border-primary/30">
        <Icon className="h-5 w-5 text-muted-foreground mr-3 transition-colors duration-300 group-focus-within:text-primary" />
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 ml-2"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default AuthInput;
