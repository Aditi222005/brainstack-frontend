import { useState } from "react";
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

const AuthInput = ({ icon: Icon, placeholder, type = "text", value, onChange }: AuthInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--color-surface-2)",
        border: focused
          ? "0.5px solid var(--color-primary)"
          : "0.5px solid var(--color-border)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 14px",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: focused ? "0 0 0 3px rgba(124,111,255,0.15)" : "none",
      }}
    >
      <Icon
        size={16}
        style={{ color: focused ? "var(--color-primary)" : "var(--color-muted)", flexShrink: 0, transition: "color 0.2s" }}
      />
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          fontWeight: 400,
          color: "var(--color-text)",
          lineHeight: 1.5,
        }}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-muted)",
            display: "flex",
            alignItems: "center",
            padding: 0,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
        >
          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      )}
    </div>
  );
};

export default AuthInput;
