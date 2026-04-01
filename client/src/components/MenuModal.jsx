import { useEffect } from "react";

function MenuModal({ title, items, onClose }) {
  // Close on Escape key
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

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>
        <div className="modal-body">
          {items.length === 0 ? (
            <p style={{ textAlign: "center", color: "#8B7D6B", padding: "2rem", fontStyle: "italic" }}>
              No items available at this time. Check back soon!
            </p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="menu-item">
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
                      <span className="happy-hour-original">${formatPrice(item.price)}</span>
                      ${formatPrice(item.happy_hour_price)}
                    </>
                  ) : (
                    <>${formatPrice(item.price)}</>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuModal;
