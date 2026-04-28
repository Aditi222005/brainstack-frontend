interface AuthLayoutProps { children: React.ReactNode; }

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg)",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <div
        className="orb"
        style={{
          width: 500,
          height: 500,
          background: "rgba(124,111,255,0.12)",
          top: "-20%",
          right: "-10%",
          animationDelay: "0s",
        }}
      />
      <div
        className="orb"
        style={{
          width: 400,
          height: 400,
          background: "rgba(0,210,200,0.07)",
          bottom: "-15%",
          left: "-10%",
          animationDelay: "5s",
        }}
      />

      {/* Card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 420,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a
            href="/"
            style={{ textDecoration: "none" }}
          >
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: 28,
                color: "var(--color-text)",
                letterSpacing: "-0.02em",
              }}
            >
              Brain<span style={{ color: "var(--color-primary)" }}>Stack</span>
            </span>
          </a>
        </div>

        {/* Content card */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "36px 32px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
