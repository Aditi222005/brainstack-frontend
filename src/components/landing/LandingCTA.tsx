import { Link } from "react-router-dom";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";

const LandingCTA = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <section
      style={{
        padding: "112px 24px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Radial glow behind the text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(124,111,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
      />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 680, margin: "0 auto" }}>
        <p className="section-label" style={{ marginBottom: 16 }}>Ready to start?</p>
        <h2
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 52px)",
            color: "var(--color-text)",
            marginBottom: 18,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          Start Building Your<br className="hidden md:block" /> BrainStack Today.
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            color: "var(--color-muted)",
            marginBottom: 40,
            lineHeight: 1.65,
            maxWidth: 480,
            margin: "0 auto 40px",
          }}
        >
          Join thousands of thinkers who have successfully extended their minds into a perfect digital workspace ecosystem.
        </p>

        {isLoggedIn ? (
          <Link
            to="/ai-board"
            data-hover="true"
            className="btn-cta"
            style={{ textDecoration: "none" }}
          >
            <LayoutDashboard size={18} />
            Go to Dashboard
          </Link>
        ) : (
          <Link
            to="/signup"
            data-hover="true"
            className="btn-cta"
            style={{ textDecoration: "none" }}
          >
            Start for Free
            <ArrowRight size={18} />
          </Link>
        )}
      </div>
    </section>
  );
};

export default LandingCTA;
