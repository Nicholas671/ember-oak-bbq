import { useEffect, useRef } from "react";
import EmberDivider from "./EmberDivider";
import AnimatedPrice from "./AnimatedPrice";

function MenuModal({ title, items, onClose }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const previouslyFocused = document.activeElement;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    // Focus trapping — keep Tab cycling inside the modal
    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      const modal = modalRef.current;
      if (!modal) return;

      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("keydown", handleTab);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("keydown", handleTab);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            ref={closeButtonRef}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          {items.length === 0 ? (
            <p style={{ textAlign: "center", color: "#8B7D6B", padding: "2rem", fontStyle: "italic" }}>
              No items available at this time. Check back soon!
            </p>
          ) : (
            items.map((item, index) => (
              <div key={item.id}>
                <div className="menu-item">
                  <div className="menu-item-info">
                    <h4>
                      {item.name}
                      {item.is_happy_hour && (
                        <span className="happy-hour-badge">Happy Hour</span>
                      )}
                    </h4>
                    {item.description && <p>{item.description}</p>}
                  </div>
                  <div className="menu-item-price">
                    {item.is_happy_hour && item.happy_hour_price ? (
                      <>
                        <span className="happy-hour-original">
                          <AnimatedPrice value={item.price} />
                        </span>
                        <AnimatedPrice value={item.happy_hour_price} />
                      </>
                    ) : (
                      <AnimatedPrice value={item.price} />
                    )}
                  </div>
                </div>
                {index < items.length - 1 && <EmberDivider width={150} />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuModal;
