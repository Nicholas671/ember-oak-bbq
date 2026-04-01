import { useState, useCallback } from "react";

export function useApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");
      const headers = { ...options.headers };

      if (token && !headers.Authorization) {
        headers.Authorization = `Bearer ${token}`;
      }

      if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(url, { ...options, headers });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("adminToken");
        setError("Session expired. Please log in again.");
        return null;
      }

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || `Request failed (${res.status})`);
      }

      setData(json);
      return json;
    } catch (err) {
      const message = err.message || "An unexpected error occurred.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, request, reset };
}
