import { PenTool, BrainCircuit, Share2 } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: <PenTool size={22} />,
    title: "Capture Ideas",
    desc: "Seamlessly jot down notes, thoughts, and external links without switching contexts.",
  },
  {
    num: "02",
    icon: <BrainCircuit size={22} />,
    title: "Connect Knowledge",
    desc: "Automatically map related thoughts using dual-linking and visual spatial canvas mapping.",
  },
  {
    num: "03",
    icon: <Share2 size={22} />,
    title: "Build Your Second Brain",
    desc: "Grow an interconnected powerhouse that thinks with you effortlessly over time.",
  },
];

const LandingWorkflow = () => {
  return (
    <section
      id="workflow"
      style={{
        padding: "96px 0",
        position: "relative",
        overflow: "hidden",
        borderTop: "0.5px solid var(--color-border)",
        borderBottom: "0.5px solid var(--color-border)",
      }}
    >
      {/* Soft BG */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(124,111,255,0.02)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p className="section-label" style={{ marginBottom: 12 }}>How It Works</p>
          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 44px)",
              color: "var(--color-text)",
              marginBottom: 14,
              letterSpacing: "-0.02em",
            }}
          >
            A workflow that just works.
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: "var(--color-muted)",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            Three simple steps to transition from scattered thoughts to a perfectly organized digital mind.
          </p>
        </div>

        {/* Steps */}
        <div
          className="workflow-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            alignItems: "start",
            gap: 0,
          }}
        >
          {steps.map((step, idx) => (
            <>
              {/* Step card */}
              <div
                key={step.num}
                data-reveal="true"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0 16px",
                }}
              >
                {/* Circle */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "rgba(124,111,255,0.08)",
                    border: "1px solid var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    color: "var(--color-primary)",
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontWeight: 800,
                      fontSize: 16,
                      color: "var(--color-primary)",
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                {/* Icon */}
                <div
                  style={{
                    color: "var(--color-primary)",
                    marginBottom: 14,
                    opacity: 0.7,
                  }}
                >
                  {step.icon}
                </div>

                <h3
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 800,
                    fontSize: 18,
                    color: "var(--color-text)",
                    marginBottom: 10,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: "var(--color-muted)",
                    lineHeight: 1.65,
                    maxWidth: 260,
                  }}
                >
                  {step.desc}
                </p>
              </div>

              {/* Connector line between steps (not after last) */}
              {idx < steps.length - 1 && (
                <div
                  key={`connector-${idx}`}
                  className="workflow-connector"
                  style={{
                    borderTop: "1px dashed rgba(255,255,255,0.12)",
                    width: "100%",
                    marginTop: 26, // align with center of circle
                    alignSelf: "start",
                  }}
                />
              )}
            </>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .workflow-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .workflow-connector {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default LandingWorkflow;
