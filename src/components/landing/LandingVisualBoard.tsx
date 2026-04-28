import { motion } from "framer-motion";
import { Link as LinkIcon } from "lucide-react";

const easeOutQuint = [0.22, 1, 0.36, 1] as const;

const LandingVisualBoard = () => {
  return (
    <section
      id="visual-board"
      style={{
        padding: "96px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <div
        className="orb"
        style={{
          width: 400,
          height: 400,
          background: "rgba(124,111,255,0.06)",
          top: "50%",
          left: "-10%",
          transform: "translateY(-50%)",
          animationDelay: "2s",
        }}
      />
      <div
        className="orb"
        style={{
          width: 350,
          height: 350,
          background: "rgba(0,210,200,0.05)",
          bottom: "-5%",
          right: "-5%",
          animationDelay: "6s",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 10 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: easeOutQuint }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <p className="section-label" style={{ marginBottom: 12 }}>Visual Mind Maps</p>
          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 44px)",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 14,
              letterSpacing: "-0.02em",
            }}
          >
            See the big picture.
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
            Connect your ideas intuitively on a vast infinite canvas, visualizing relationships in a dynamically networked ecosystem.
          </p>
        </motion.div>

        {/* Board mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 32 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, ease: easeOutQuint }}
        >
          <div
            style={{
              background: "var(--color-surface)",
              border: "0.5px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: 2,
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                aspectRatio: "16/9",
                borderRadius: 18,
                overflow: "hidden",
                background: "rgba(11,15,26,0.95)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Mock toolbar */}
              <div
                style={{
                  height: 48,
                  borderBottom: "0.5px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 20px",
                  gap: 8,
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(239,68,68,0.5)" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(234,179,8,0.5)" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(34,197,94,0.5)" }} />
                <div style={{ flex: 1 }} />
                <div
                  style={{
                    width: 120,
                    height: 24,
                    background: "rgba(124,111,255,0.08)",
                    border: "0.5px solid var(--color-border)",
                    borderRadius: 99,
                  }}
                />
              </div>

              {/* Canvas */}
              <div style={{ flex: 1, position: "relative" }}>
                {/* Central node */}
                <motion.div
                  drag
                  dragConstraints={{ top: -20, left: -20, right: 20, bottom: 20 }}
                  dragElastic={0.1}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.04 }}
                  style={{
                    position: "absolute",
                    top: "20%",
                    left: "16%",
                    width: 200,
                    padding: "14px 18px",
                    background: "rgba(124,111,255,0.07)",
                    border: "0.5px solid rgba(124,111,255,0.25)",
                    borderRadius: "var(--radius-md)",
                    cursor: "grab",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--color-text)",
                      marginBottom: 8,
                    }}
                  >
                    Central Node
                  </h4>
                  <div
                    style={{
                      height: 4,
                      background: "rgba(124,111,255,0.5)",
                      borderRadius: 99,
                      marginBottom: 6,
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      color: "var(--color-muted)",
                    }}
                  >
                    Core idea generation & mapping.
                  </p>
                </motion.div>

                {/* Connected branch */}
                <motion.div
                  drag
                  dragConstraints={{ top: -20, left: -20, right: 20, bottom: 20 }}
                  dragElastic={0.1}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.04 }}
                  style={{
                    position: "absolute",
                    top: "10%",
                    right: "15%",
                    width: 210,
                    padding: "14px 18px",
                    background: "rgba(0,210,200,0.06)",
                    border: "0.5px solid rgba(0,210,200,0.25)",
                    borderRadius: "var(--radius-md)",
                    cursor: "grab",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--color-text)",
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <LinkIcon style={{ width: 12, height: 12, color: "var(--color-secondary)" }} />
                    Connected Branch
                  </h4>
                  <div
                    style={{
                      height: 4,
                      width: "80%",
                      background: "rgba(0,210,200,0.5)",
                      borderRadius: 99,
                      marginBottom: 6,
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      color: "var(--color-muted)",
                    }}
                  >
                    Synthesizing relationships.
                  </p>
                </motion.div>

                {/* Deep discovery node */}
                <motion.div
                  drag
                  dragConstraints={{ top: -20, left: -20, right: 20, bottom: 20 }}
                  dragElastic={0.1}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.04 }}
                  style={{
                    position: "absolute",
                    bottom: "18%",
                    right: "20%",
                    width: 190,
                    padding: "14px 18px",
                    background: "rgba(124,111,255,0.05)",
                    border: "0.5px solid rgba(124,111,255,0.2)",
                    borderRadius: "var(--radius-md)",
                    cursor: "grab",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--color-text)",
                      marginBottom: 8,
                    }}
                  >
                    Deep Discovery
                  </h4>
                  <div
                    style={{
                      height: 4,
                      background: "rgba(124,111,255,0.4)",
                      borderRadius: 99,
                      marginBottom: 6,
                    }}
                  />
                  <div
                    style={{
                      height: 4,
                      width: "65%",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 99,
                      marginBottom: 6,
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      color: "var(--color-muted)",
                    }}
                  >
                    Further exploration paths.
                  </p>
                </motion.div>

                {/* SVG connecting lines */}
                <svg
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 0,
                    opacity: 0.4,
                  }}
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: easeOutQuint, delay: 0.6 }}
                    d="M 320 110 C 400 110, 450 60, 520 55"
                    stroke="url(#vbg1)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: easeOutQuint, delay: 0.9 }}
                    d="M 320 130 C 400 160, 450 210, 490 220"
                    stroke="url(#vbg2)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="5 5"
                  />
                  <defs>
                    <linearGradient id="vbg1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7C6FFF" />
                      <stop offset="100%" stopColor="#00D2C8" />
                    </linearGradient>
                    <linearGradient id="vbg2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7C6FFF" />
                      <stop offset="100%" stopColor="#7C6FFF" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingVisualBoard;
