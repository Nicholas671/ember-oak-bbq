import { useState, useEffect } from "react";

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      style={{
        position: "fixed",
        bottom: "30px",
        left: "30px",
        width: "46px",
        height: "46px",
        borderRadius: "50%",
        border: "2px solid var(--amber)",
        background: "var(--oak-dark)",
        color: "var(--amber)",
        fontSize: "1.2rem",
        cursor: "pointer",
        zIndex: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: visible ? "auto" : "none",
        boxShadow: "0 4px 15px rgba(62, 33, 15, 0.4)",
      }}
    >
      ↑
    </button>
  );
}

export default BackToTop;
