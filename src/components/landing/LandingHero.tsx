import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Wand2, LayoutDashboard } from "lucide-react";

const LandingHero = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [text, setText] = useState("");
  const fullText = "Summarize the cognitive science literature...";

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  // Typewriter for dashboard preview
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 55);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      {/* ── Background orbs ── */}
      <div
        className="orb"
        style={{
          width: "clamp(300px, 40vw, 600px)",
          height: "clamp(300px, 40vw, 600px)",
          background: "rgba(124,111,255,0.18)",
          top: "-10%",
          left: "-8%",
          animationDelay: "0s",
        }}
      />
      <div
        className="orb"
        style={{
          width: "clamp(250px, 35vw, 500px)",
          height: "clamp(250px, 35vw, 500px)",
          background: "rgba(0,210,200,0.13)",
          bottom: "-5%",
          right: "-5%",
          animationDelay: "4s",
        }}
      />
      <div
        className="orb"
        style={{
          width: "clamp(200px, 25vw, 350px)",
          height: "clamp(200px, 25vw, 350px)",
          background: "rgba(249,115,22,0.08)",
          top: "40%",
          left: "45%",
          animationDelay: "8s",
        }}
      />

      {/* ── Hero content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 840,
          width: "100%",
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        {/* Badge pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(124,111,255,0.10)",
            border: "1px solid var(--color-border-hover)",
            borderRadius: 999,
            padding: "6px 16px",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--color-primary)",
              display: "inline-block",
              animation: "pulseDot 1.6s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--color-primary)",
            }}
          >
            Now available for all fields
          </span>
        </div>

        {/* H1 */}
        <h1
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(36px, 5.5vw, 60px)",
            lineHeight: 1.12,
            color: "var(--color-text)",
            marginBottom: 20,
            letterSpacing: "-0.02em",
          }}
        >
          Build Your{" "}
          <span style={{ color: "var(--color-primary)" }}>Second Brain</span>
          <br />
          with{" "}
          <span style={{ color: "var(--color-secondary)" }}>BrainStack</span>
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            fontWeight: 400,
            color: "var(--color-muted)",
            lineHeight: 1.65,
            marginBottom: 40,
            maxWidth: 540,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Capture ideas instantly, organize knowledge organically, and visualize
          every connection in a deeply intelligent workspace.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            marginBottom: 56,
          }}
        >
          {isLoggedIn ? (
            <Link
              to="/ai-board"
              data-hover="true"
              className="btn-primary"
              style={{ textDecoration: "none", fontSize: 15 }}
            >
              <LayoutDashboard size={18} />
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/signup"
              data-hover="true"
              className="btn-primary"
              style={{ textDecoration: "none", fontSize: 15 }}
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
          )}
          <a
            href="#visual-board"
            data-hover="true"
            className="btn-ghost"
            style={{ fontSize: 15 }}
          >
            View Demo
          </a>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 40,
          }}
        >
          {[
            { value: "10k+", label: "Ideas Captured" },
            { value: "2k+", label: "Active Thinkers" },
            { value: "95%", label: "Faster Learning" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 800,
                  fontSize: 28,
                  color: "var(--color-primary)",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "var(--color-muted)",
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Dashboard preview ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: 64,
          maxWidth: 900,
          width: "100%",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            background: "var(--color-surface)",
            border: "0.5px solid var(--color-border)",
            borderRadius: var_radius_lg,
            padding: 2,
            boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              background: "rgba(11,15,26,0.9)",
              aspectRatio: "16/10",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Fake toolbar */}
            <div
              style={{
                height: 52,
                borderBottom: "0.5px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 20px",
              }}
            >
              <div
                style={{
                  maxWidth: 420,
                  width: "100%",
                  height: 34,
                  background: "rgba(124,111,255,0.06)",
                  border: "0.5px solid var(--color-border)",
                  borderRadius: 99,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 14px",
                  gap: 8,
                }}
              >
                <Wand2 style={{ width: 14, height: 14, color: "var(--color-secondary)" }} />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "var(--color-muted)",
                  }}
                >
                  {text}
                </span>
              </div>
            </div>

            {/* Canvas area with floating nodes */}
            <div style={{ flex: 1, position: "relative", padding: 24 }}>
              {/* Node 1 */}
              <div
                style={{
                  position: "absolute",
                  top: "25%",
                  left: "18%",
                  width: 200,
                  padding: "16px 20px",
                  background: "rgba(124,111,255,0.07)",
                  border: "0.5px solid rgba(124,111,255,0.2)",
                  borderRadius: 12,
                  animation: "floatOrb 6s ease-in-out infinite",
                  animationDelay: "0s",
                }}
              >
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--color-text)", marginBottom: 8 }}>
                  AI Research
                </div>
                <div style={{ height: 4, background: "rgba(124,111,255,0.5)", borderRadius: 99, marginBottom: 6 }} />
                <div style={{ height: 4, width: "70%", background: "rgba(255,255,255,0.08)", borderRadius: 99 }} />
              </div>
              {/* Node 2 */}
              <div
                style={{
                  position: "absolute",
                  bottom: "20%",
                  right: "18%",
                  width: 220,
                  padding: "16px 20px",
                  background: "rgba(0,210,200,0.06)",
                  border: "0.5px solid rgba(0,210,200,0.2)",
                  borderRadius: 12,
                  animation: "floatOrb 7s ease-in-out infinite",
                  animationDelay: "2s",
                }}
              >
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--color-text)", marginBottom: 8 }}>
                  Cognitive Models
                </div>
                <div style={{ height: 4, background: "rgba(0,210,200,0.5)", borderRadius: 99, marginBottom: 6 }} />
                <div style={{ height: 4, width: "80%", background: "rgba(255,255,255,0.08)", borderRadius: 99 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// CSS variable can't be used in JS string directly; use literal
const var_radius_lg = "20px";

export default LandingHero;