import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SpecialsPopup from "../components/SpecialsPopup";

function Home() {
  const [popup, setPopup] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if popup has been dismissed this session
    const dismissed = sessionStorage.getItem("popupDismissed");
    if (dismissed) return;

    fetch("/api/admin/popup")
      .then((res) => res.json())
      .then((data) => {
        if (data.landing_popup?.is_active && data.landing_popup?.value) {
          setPopup({
            title: data.popup_title?.value || "Welcome!",
            message: data.landing_popup.value,
          });
          setShowPopup(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    sessionStorage.setItem("popupDismissed", "true");
  };

  return (
    <>
      {showPopup && popup && (
        <SpecialsPopup
          title={popup.title}
          message={popup.message}
          onClose={handleClosePopup}
        />
      )}

      <section className="hero">
        <div className="hero-content">
          <p className="hero-tagline">Asheville's Finest Smokehouse</p>
          <h1>
            Ember <span className="ampersand">&</span> Oak
          </h1>
          <div className="hero-divider" />
          <p className="hero-description">
            Where slow-smoked perfection meets refined Southern dining.
            Every cut tells a story, every bite an experience.
          </p>
          <div className="hero-buttons">
            <Link to="/menu" className="btn btn-primary">
              Explore Our Menu
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Reserve a Table
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="page-section">
        <div className="page-header">
          <p className="overline">The Experience</p>
          <h2>Crafted with Fire & Patience</h2>
          <div className="divider" />
          <p>
            14 hours of slow smoking. Locally sourced hardwoods. Hand-selected
            prime cuts. This is BBQ elevated to an art form.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔥</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--oak)", marginBottom: "0.5rem" }}>
              Wood-Fired
            </h3>
            <p style={{ color: "var(--ash)", lineHeight: 1.7 }}>
              We use a blend of oak and hickory, hand-split every morning.
              No shortcuts, no gas — just wood, fire, and time.
            </p>
          </div>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🥩</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--oak)", marginBottom: "0.5rem" }}>
              Prime Cuts
            </h3>
            <p style={{ color: "var(--ash)", lineHeight: 1.7 }}>
              We source from local farms and select only USDA Prime and
              Choice beef. Every brisket is hand-trimmed by our pitmaster.
            </p>
          </div>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🍸</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--oak)", marginBottom: "0.5rem" }}>
              Craft Bar
            </h3>
            <p style={{ color: "var(--ash)", lineHeight: 1.7 }}>
              Smoked cocktails, local brews, and a curated bourbon list.
              Our bar program is designed to complement the smoke.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: "linear-gradient(135deg, var(--oak-dark), var(--charcoal))",
        padding: "5rem 2rem",
        textAlign: "center",
      }}>
        <p style={{ fontFamily: "var(--font-accent)", fontSize: "0.9rem", color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: "0.5rem" }}>
          Happy Hour
        </p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", color: "var(--cream)", marginBottom: "1rem" }}>
          Tues – Fri, 4pm – 6pm
        </h2>
        <p style={{ fontFamily: "var(--font-accent)", fontSize: "1.1rem", color: "var(--ash)", fontStyle: "italic", maxWidth: "500px", margin: "0 auto 2rem" }}>
          Discounted bites, draft beers, and signature cocktails.
          The best way to start your evening.
        </p>
        <Link to="/menu" className="btn btn-amber">
          See Happy Hour Menu
        </Link>
      </section>
    </>
  );
}

export default Home;
