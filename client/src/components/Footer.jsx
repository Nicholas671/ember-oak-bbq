import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer has-grain">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            Ember <span className="ampersand">&</span> Oak
          </div>
          <p>
            Upscale smokehouse dining in the heart of Asheville.
            Slow-smoked meats, craft cocktails, and Southern hospitality
            done right.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/menu">Our Menu</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>127 Smokehouse Lane</p>
          <p>Asheville, NC 28801</p>
          <p style={{ marginTop: "0.5rem" }}>
            <a href="tel:+18285550142">(828) 555-0142</a>
          </p>
          <p>
            <a href="mailto:info@emberandoak.com">info@emberandoak.com</a>
          </p>

          <div className="social-links">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="X / Twitter"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
            </a>
            <a
              href="https://yelp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Yelp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 17l-2 5h4z" />
                <path d="M6.5 19.5l3-3" />
                <path d="M17.5 19.5l-3-3" />
                <circle cx="12" cy="10" r="5" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Ember & Oak BBQ. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
