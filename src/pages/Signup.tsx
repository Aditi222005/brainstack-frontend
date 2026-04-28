import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!agreed) { setError("Please agree to the terms and conditions"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        navigate("/ai-board");
      } else {
        setError(data.message || "Failed to create account");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header */}
        <div style={{ marginBottom: 4 }}>
          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: 22,
              color: "var(--color-text)",
              marginBottom: 4,
            }}
          >
            Create your account
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--color-muted)" }}>
            Start building your second brain today
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              borderLeft: "3px solid #ef4444",
              background: "rgba(239,68,68,0.08)",
              padding: "10px 14px",
              borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#f87171",
            }}
          >
            {error}
          </div>
        )}

        <GoogleButton label="Sign up with Google" />

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--color-muted)" }}>
            or via email
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
        </div>

        <AuthInput icon={User} placeholder="Full name" value={name} onChange={setName} />
        <AuthInput icon={Mail} placeholder="Email address" type="email" value={email} onChange={setEmail} />
        <AuthInput icon={Phone} placeholder="Phone number" type="tel" value={phone} onChange={setPhone} />
        <AuthInput icon={Lock} placeholder="Password" type="password" value={password} onChange={setPassword} />
        <AuthInput icon={Lock} placeholder="Confirm password" type="password" value={confirmPassword} onChange={setConfirmPassword} />

        {/* Terms checkbox */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <button
            type="button"
            id="agree-terms-btn"
            onClick={() => setAgreed(!agreed)}
            style={{
              marginTop: 2,
              width: 18,
              height: 18,
              flexShrink: 0,
              borderRadius: 4,
              border: agreed ? "none" : "1.5px solid var(--color-border)",
              background: agreed ? "var(--color-primary)" : "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s, border 0.2s",
            }}
          >
            {agreed && (
              <svg viewBox="0 0 10 8" width={10} height={8} fill="none">
                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--color-muted)", lineHeight: 1.5 }}>
            I agree to the{" "}
            <a
              href="#"
              style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 500 }}
            >
              Terms and Conditions
            </a>
          </span>
        </div>

        <button
          type="submit"
          id="signup-submit-btn"
          disabled={loading}
          data-hover="true"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "var(--color-primary)",
            color: "#ffffff",
            border: "none",
            borderRadius: 999,
            padding: "12px 24px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s",
            marginTop: 4,
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(124,111,255,0.4)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }}
        >
          {loading ? "Creating account…" : "Create Account"}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <p
        style={{
          marginTop: 20,
          textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "var(--color-muted)",
          paddingTop: 16,
          borderTop: "0.5px solid var(--color-border)",
        }}
      >
        Already have an account?{" "}
        <Link
          to="/login"
          style={{ color: "var(--color-primary)", fontWeight: 500, textDecoration: "none" }}
        >
          Sign in →
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
