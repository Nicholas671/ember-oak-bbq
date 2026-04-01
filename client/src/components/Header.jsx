import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-main">
            Ember <span className="ampersand">&</span> Oak
          </span>
          <span className="logo-sub">Smokehouse &bull; Bar</span>
        </Link>

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`nav-link ${isActive("/about") ? "active" : ""}`}
            onClick={closeMenu}
          >
            About
          </Link>
          <Link
            to="/menu"
            className={`nav-link ${isActive("/menu") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Menu
          </Link>
          <Link
            to="/contact"
            className={`nav-link ${isActive("/contact") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Contact
          </Link>
          <Link
            to="/admin/login"
            className={`nav-link ${isActive("/admin/login") || isActive("/admin") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
