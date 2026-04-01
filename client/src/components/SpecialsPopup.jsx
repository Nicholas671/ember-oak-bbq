import { useEffect } from "react";

function SpecialsPopup({ title, message, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="specials-popup-overlay" onClick={handleOverlayClick}>
      <div className="specials-popup">
        <button
          className="specials-popup-close"
          onClick={onClose}
          aria-label="Close popup"
        >
          ✕
        </button>
        <div className="popup-flame">🔥</div>
        <h2>{title || "Welcome!"}</h2>
        <p>{message}</p>
        <button className="btn btn-primary" onClick={onClose}>
          View Our Menu
        </button>
      </div>
    </div>
  );
}

export default SpecialsPopup;
