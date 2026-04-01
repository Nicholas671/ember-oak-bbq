import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setIsVerifying(false);
      return;
    }

    fetch("/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          setIsValid(true);
        } else {
          localStorage.removeItem("adminToken");
        }
      })
      .catch(() => {
        localStorage.removeItem("adminToken");
      })
      .finally(() => setIsVerifying(false));
  }, []);

  if (isVerifying) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <p style={{ fontFamily: "var(--font-accent)", fontSize: "1.2rem", color: "var(--ash)", fontStyle: "italic" }}>
          Verifying access...
        </p>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
