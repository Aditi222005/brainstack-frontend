import { Github, Twitter, Linkedin } from "lucide-react";

const LandingFooter = () => {
  return (
    <footer
      style={{
        borderTop: "0.5px solid var(--color-border)",
        padding: "20px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {/* Left: copyright */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: "var(--color-muted)",
          }}
        >
          © 2025 BrainStack. All rights reserved.
        </p>

        {/* Right: links + socials */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {["Privacy", "Terms"].map((label) => (
            <a
              key={label}
              href="#"
              data-hover="true"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "var(--color-muted)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
            >
              {label}
            </a>
          ))}

          {/* Social icons */}
          {[
            { icon: <Github size={15} />, href: "#", label: "GitHub" },
            { icon: <Twitter size={15} />, href: "#", label: "Twitter" },
            { icon: <Linkedin size={15} />, href: "#", label: "LinkedIn" },
          ].map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              data-hover="true"
              aria-label={label}
              style={{
                color: "var(--color-muted)",
                textDecoration: "none",
                transition: "color 0.2s ease",
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
