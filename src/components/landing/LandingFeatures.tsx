import { useState } from "react";
import { LayoutDashboard, FileText, Share2, Sparkles, Tags, Search } from "lucide-react";

const features = [
  {
    icon: <LayoutDashboard />,
    title: "Visual Boards",
    description: "Map out your ideas on a vast infinite canvas, visually linking knowledge perfectly.",
  },
  {
    icon: <FileText />,
    title: "Smart Notes",
    description: "Format and embed any content easily into a highly intuitive rich-text environment.",
  },
  {
    icon: <Share2 />,
    title: "Knowledge Graph",
    description: "Understand the hidden relationships between notes through automated deep linking.",
  },
  {
    icon: <Sparkles />,
    title: "AI Suggestions",
    description: "Let AI synthesize and suggest insights based on your existing workspace history.",
  },
  {
    icon: <Tags />,
    title: "Tag & Link System",
    description: "Build robust networked systems easily mapping diverse information instantly.",
  },
  {
    icon: <Search />,
    title: "Quick Search",
    description: "Instantly retrieve your second brain documents seamlessly anywhere via spotlight.",
  },
];

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [hovered, setHovered] = useState(false);
  const isCoarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCoarse) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 20;
    const rotateX = -((y / rect.height) - 0.5) * 20;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setHovered(false);
  };

  return (
    <div
      data-reveal="true"
      data-hover="true"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        background: "var(--color-surface)",
        border: hovered ? "0.5px solid var(--color-border-hover)" : "0.5px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: 28,
        position: "relative",
        overflow: "hidden",
        transform: `perspective(400px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: "border-color 0.25s ease, box-shadow 0.25s ease, transform 0.1s ease",
        boxShadow: hovered ? "0 0 0 1px rgba(124,111,255,0.2), 0 8px 32px rgba(0,0,0,0.3)" : "none",
        animationDelay: `${delay}s`,
      }}
    >
      {/* Icon container */}
      <div
        style={{
          width: 44,
          height: 44,
          background: "rgba(124,111,255,0.10)",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-primary)",
          marginBottom: 18,
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: "var(--color-text)",
          marginBottom: 8,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: "var(--color-muted)",
          lineHeight: 1.65,
        }}
      >
        {description}
      </p>
    </div>
  );
};

const LandingFeatures = () => {
  return (
    <section
      id="features"
      style={{
        padding: "96px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle horizontal separator lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,0.015)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 10 }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p
            className="section-label"
            style={{ marginBottom: 12 }}
          >
            What You Get
          </p>
          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 44px)",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            Everything you need.
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: "var(--color-muted)",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            A comprehensive suite of tools built to extend your mind, seamlessly connected in a unified intelligent workspace.
          </p>
        </div>

        {/* Feature grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {features.map((feature, idx) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={idx * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
