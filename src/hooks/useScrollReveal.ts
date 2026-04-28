import { useEffect } from "react";

/**
 * Observes all elements with data-reveal="true" and adds .fade-up
 * plus a stagger class (.fade-up-1 through .fade-up-4) on intersection.
 */
const useScrollReveal = () => {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal='true']");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const idx = parseInt(el.dataset.revealIdx ?? "0", 10);
            const stagger = Math.min(idx % 4 + 1, 4);
            el.classList.add("fade-up", `fade-up-${stagger}`);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el, idx) => {
      el.dataset.revealIdx = String(idx);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
};

export default useScrollReveal;
