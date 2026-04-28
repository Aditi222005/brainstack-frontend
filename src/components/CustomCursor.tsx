import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    // hide the system cursor on the page body
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      dot.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;

      // Hover check
      const target = e.target as Element;
      const isHoverable =
        target.closest("[data-hover='true']") ||
        target.closest("a") ||
        target.closest("button");

      if (isHoverable) {
        dot.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px) scale(1.8)`;
        dot.style.background = "var(--color-secondary)";
        ringEl.style.width = "52px";
        ringEl.style.height = "52px";
        ringEl.style.borderColor = "rgba(0,210,200,0.5)";
      } else {
        dot.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px) scale(1)`;
        dot.style.background = "var(--color-primary)";
        ringEl.style.width = "36px";
        ringEl.style.height = "36px";
        ringEl.style.borderColor = "rgba(124,111,255,0.5)";
      }
    };

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      ringEl.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`;
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "var(--color-primary)",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "screen",
          transition: "transform 0.12s ease, background 0.2s ease, width 0.2s ease, height 0.2s ease",
          willChange: "transform",
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid rgba(124,111,255,0.5)",
          pointerEvents: "none",
          zIndex: 9998,
          transition: "width 0.25s ease, height 0.25s ease, border-color 0.25s ease",
          willChange: "transform",
        }}
      />
    </>
  );
};

export default CustomCursor;
