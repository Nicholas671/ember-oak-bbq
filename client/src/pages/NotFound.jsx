import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔥</div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(3rem, 8vw, 6rem)",
          color: "var(--oak-dark)",
          lineHeight: 1,
          marginBottom: "0.5rem",
        }}
      >
        404
      </h1>
      <p
        style={{
          fontFamily: "var(--font-accent)",
          fontSize: "1.3rem",
          color: "var(--ash)",
          fontStyle: "italic",
          marginBottom: "0.5rem",
        }}
      >
        Looks like this page went up in smoke.
      </p>
      <p
        style={{
          color: "var(--ash)",
          fontSize: "0.95rem",
          marginBottom: "2rem",
          maxWidth: "400px",
        }}
      >
        The page you're looking for doesn't exist or may have been moved.
        Let's get you back to the good stuff.
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
        <Link to="/menu" className="btn btn-secondary" style={{ color: "var(--charcoal)", borderColor: "var(--amber)" }}>
          View Menu
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
