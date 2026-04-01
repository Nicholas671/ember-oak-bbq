import { useEffect, useCallback } from "react";

function Lightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const current = images[currentIndex];
  if (!current) return null;

  const navBtnStyle = (side) => ({
    position: "absolute",
    [side]: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.1)",
    border: "none",
    color: "white",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    fontSize: "1.5rem",
    cursor: "pointer",
    zIndex: 2,
    transition: "background 0.3s",
  });

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 6000,
        background: "rgba(0, 0, 0, 0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "none",
          border: "2px solid rgba(255,255,255,0.3)",
          color: "white",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          fontSize: "1.2rem",
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        ✕
      </button>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Previous image"
          style={navBtnStyle("left")}
        >
          ‹
        </button>
      )}

      <img
        src={current.src}
        alt={current.alt}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "85vh",
          objectFit: "contain",
          borderRadius: "8px",
          animation: "popIn 0.3s ease",
          boxShadow: "0 15px 50px rgba(0,0,0,0.5)",
        }}
      />

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Next image"
          style={navBtnStyle("right")}
        >
          ›
        </button>
      )}

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.6)",
          fontFamily: "var(--font-body)",
          fontSize: "0.85rem",
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

export default Lightbox;
