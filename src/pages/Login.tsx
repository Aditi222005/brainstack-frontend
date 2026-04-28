import { useState } from "react";
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
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        navigate("/dashboard");
      } else {
        setError(data.message || "Failed to login");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: 22,
              color: "var(--color-text)",
              marginBottom: 4,
            }}
          >
            Welcome back
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--color-muted)" }}>
            Sign in to your BrainStack account
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

        <GoogleButton label="Sign in with Google" />

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: "var(--color-muted)",
            }}
          >
            or via email
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
        </div>

        <AuthInput icon={Mail} placeholder="Email address" type="email" value={email} onChange={setEmail} />
        <AuthInput icon={Lock} placeholder="Password" type="password" value={password} onChange={setPassword} />

        <div style={{ textAlign: "right" }}>
          <a
            href="#"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "var(--color-muted)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          id="login-submit-btn"
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
          {loading ? "Signing in…" : "Sign In"}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <p
        style={{
          marginTop: 24,
          textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "var(--color-muted)",
          paddingTop: 20,
          borderTop: "0.5px solid var(--color-border)",
        }}
      >
        Don't have an account?{" "}
        <Link
          to="/signup"
          style={{
            color: "var(--color-primary)",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Create one →
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
