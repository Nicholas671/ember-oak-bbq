import { useState, useEffect, useCallback } from "react";
import { useToast } from "../components/Toast";

const API_BASE = "/api";

function Admin() {
  const toast = useToast();

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState("menu");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [popupSettings, setPopupSettings] = useState({ title: "", message: "", is_active: false });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });

  const getToken = () => localStorage.getItem("adminToken");

  const authHeaders = useCallback(() => ({
    Authorization: `Bearer ${getToken()}`,
  }), []);

  const authJsonHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  }), []);

  // Verify token on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsVerifying(false);
      return;
    }

    fetch(`${API_BASE}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("adminToken");
        }
      })
      .catch(() => {
        localStorage.removeItem("adminToken");
      })
      .finally(() => setIsVerifying(false));
  }, []);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        setIsAuthenticated(true);
        toast("Welcome back!", "success");
      } else {
        setLoginError(data.error || "Invalid credentials.");
      }
    } catch (err) {
      setLoginError("Unable to connect to the server.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Fetch all menu items
  const fetchMenu = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/menu/all`, { headers: authHeaders() });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("adminToken");
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  // Fetch popup settings
  const fetchPopup = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/popup`);
      const data = await res.json();
      setPopupSettings({
        title: data.popup_title?.value || "",
        message: data.landing_popup?.value || "",
        is_active: data.landing_popup?.is_active || false,
      });
    } catch (err) {
      console.error("Failed to fetch popup:", err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMenu();
      fetchPopup();
    }
  }, [isAuthenticated, fetchMenu, fetchPopup]);

  // Toggle happy hour — optimistic UI
  const toggleHappyHour = async (item) => {
    const newState = !item.is_happy_hour;
    const newHHPrice = newState ? (item.price * 0.7).toFixed(2) : null;

    // Optimistically update immediately
    setMenuItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, is_happy_hour: newState, happy_hour_price: newHHPrice }
          : i
      )
    );
    toast(`${item.name} ${newState ? "added to" : "removed from"} Happy Hour`, "success");

    try {
      const res = await fetch(`${API_BASE}/menu/${item.id}/happy-hour`, {
        method: "PATCH",
        headers: authJsonHeaders(),
        body: JSON.stringify({
          is_happy_hour: newState,
          happy_hour_price: newHHPrice,
        }),
      });
      if (!res.ok) throw new Error("Failed");
    } catch (err) {
      // Revert on failure
      setMenuItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, is_happy_hour: item.is_happy_hour, happy_hour_price: item.happy_hour_price }
            : i
        )
      );
      toast(`Failed to update ${item.name}. Change reverted.`, "error");
    }
  };

  // Toggle availability — optimistic UI
  const toggleAvailability = async (item) => {
    const newState = !item.is_available;

    setMenuItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, is_available: newState } : i
      )
    );
    toast(`${item.name} is now ${newState ? "visible" : "hidden"}`, "success");

    try {
      const res = await fetch(`${API_BASE}/menu/${item.id}/availability`, {
        method: "PATCH",
        headers: authJsonHeaders(),
        body: JSON.stringify({ is_available: newState }),
      });
      if (!res.ok) throw new Error("Failed");
    } catch (err) {
      setMenuItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, is_available: item.is_available } : i
        )
      );
      toast("Failed to update. Change reverted.", "error");
    }
  };

  // Delete item
  const deleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`${API_BASE}/menu/${item.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        fetchMenu();
        toast(`${item.name} deleted.`, "success");
      }
    } catch (err) {
      toast("Failed to delete item.", "error");
    }
  };

  // Save popup settings
  const savePopup = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/popup`, {
        method: "PUT",
        headers: authJsonHeaders(),
        body: JSON.stringify(popupSettings),
      });
      if (res.ok) {
        toast("Popup settings saved!", "success");
      }
    } catch (err) {
      toast("Failed to save popup settings.", "error");
    }
  };

  // Change password
  const changePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast("New passwords don't match.", "error");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: "PUT",
        headers: authJsonHeaders(),
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast("Password changed successfully!", "success");
        setPasswordForm({ currentPassword: "", newPassword: "", confirm: "" });
      } else {
        toast(data.error || "Failed to change password.", "error");
      }
    } catch (err) {
      toast("Failed to change password.", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setLoginForm({ username: "", password: "" });
    toast("Logged out.", "info");
  };

  const formatPrice = (p) => p ? parseFloat(p).toFixed(2) : "—";

  // Show loading while verifying token
  if (isVerifying) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <p style={{ fontFamily: "var(--font-accent)", fontSize: "1.2rem", color: "var(--ash)", fontStyle: "italic" }}>
          Verifying access...
        </p>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Admin Access</h2>
          <p className="subtitle">Ember & Oak Management Portal</p>

          {loginError && <div className="error-message">{loginError}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ textAlign: "left" }}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group" style={{ textAlign: "left" }}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loginLoading}
              style={{ width: "100%" }}
            >
              {loginLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard (authenticated)
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Ember & Oak — Dashboard</h1>
        <button className="btn btn-small btn-secondary" onClick={handleLogout} style={{ color: "var(--cream)", borderColor: "var(--ash)" }}>
          Logout
        </button>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === "menu" ? "active" : ""}`} onClick={() => setActiveTab("menu")}>
          Menu Items
        </button>
        <button className={`admin-tab ${activeTab === "popup" ? "active" : ""}`} onClick={() => setActiveTab("popup")}>
          Landing Popup
        </button>
        <button className={`admin-tab ${activeTab === "password" ? "active" : ""}`} onClick={() => setActiveTab("password")}>
          Change Password
        </button>
      </div>

      <div className="admin-content">

        {/* ===== MENU TAB ===== */}
        {activeTab === "menu" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--oak-dark)" }}>
                Menu Management
              </h2>
              <button className="btn btn-primary btn-small" onClick={() => { setEditingItem(null); setShowForm(true); }}>
                + Add Item
              </button>
            </div>

            {loading ? (
              <p style={{ textAlign: "center", color: "var(--ash)", fontStyle: "italic" }}>Loading menu items...</p>
            ) : (
              <div className="admin-table-container" style={{ overflowX: "auto" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Happy Hour</th>
                      <th>HH Price</th>
                      <th>Visible</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item.id} style={{ opacity: item.is_available ? 1 : 0.5 }}>
                        <td>
                          {item.image_url && !item.image_url.includes("default") ? (
                            <img src={item.image_url} alt={item.name} className="item-image" />
                          ) : (
                            <div className="item-image-placeholder">No img</div>
                          )}
                        </td>
                        <td style={{ fontWeight: 600 }}>{item.name}</td>
                        <td style={{ textTransform: "capitalize" }}>{item.category}</td>
                        <td>${formatPrice(item.price)}</td>
                        <td>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={item.is_happy_hour}
                              onChange={() => toggleHappyHour(item)}
                            />
                            <span className="toggle-slider" />
                          </label>
                        </td>
                        <td>{item.is_happy_hour ? `$${formatPrice(item.happy_hour_price)}` : "—"}</td>
                        <td>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={item.is_available}
                              onChange={() => toggleAvailability(item)}
                            />
                            <span className="toggle-slider" />
                          </label>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              className="btn btn-small btn-secondary"
                              style={{ color: "var(--charcoal)", borderColor: "var(--ash)", padding: "0.35rem 0.8rem" }}
                              onClick={() => { setEditingItem(item); setShowForm(true); }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-small btn-danger"
                              style={{ padding: "0.35rem 0.8rem" }}
                              onClick={() => deleteItem(item)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ===== POPUP TAB ===== */}
        {activeTab === "popup" && (
          <div className="popup-editor">
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--oak-dark)", marginBottom: "1.5rem" }}>
              Landing Page Popup
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={popupSettings.is_active}
                  onChange={() => setPopupSettings({ ...popupSettings, is_active: !popupSettings.is_active })}
                />
                <span className="toggle-slider" />
              </label>
              <span style={{ fontWeight: 600, color: popupSettings.is_active ? "var(--success)" : "var(--ash)" }}>
                {popupSettings.is_active ? "Popup is ACTIVE" : "Popup is OFF"}
              </span>
            </div>

            <div className="form-group">
              <label>Popup Title</label>
              <input
                type="text"
                value={popupSettings.title}
                onChange={(e) => setPopupSettings({ ...popupSettings, title: e.target.value })}
                placeholder="e.g., Happy St. Patrick's Day!"
              />
            </div>

            <div className="form-group">
              <label>Popup Message</label>
              <textarea
                value={popupSettings.message}
                onChange={(e) => setPopupSettings({ ...popupSettings, message: e.target.value })}
                placeholder="e.g., Join us for green beer and smoked corned beef all weekend!"
                style={{ minHeight: "120px" }}
              />
            </div>

            <button className="btn btn-primary" onClick={savePopup}>
              Save Popup Settings
            </button>

            {/* Preview */}
            {popupSettings.title || popupSettings.message ? (
              <div className="popup-preview">
                <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--ash)", marginBottom: "1rem" }}>
                  Preview
                </p>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔥</div>
                <h3>{popupSettings.title || "Untitled"}</h3>
                <p>{popupSettings.message || "No message yet..."}</p>
              </div>
            ) : null}
          </div>
        )}

        {/* ===== PASSWORD TAB ===== */}
        {activeTab === "password" && (
          <div style={{ maxWidth: "500px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--oak-dark)", marginBottom: "1.5rem" }}>
              Change Password
            </h2>
            <div className="contact-form-wrapper">
              <form onSubmit={changePassword}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ===== ADD/EDIT FORM MODAL ===== */}
      {showForm && (
        <MenuItemForm
          item={editingItem}
          token={getToken()}
          onClose={() => { setShowForm(false); setEditingItem(null); }}
          onSaved={() => { setShowForm(false); setEditingItem(null); fetchMenu(); toast(editingItem ? "Item updated!" : "Item added!", "success"); }}
        />
      )}
    </div>
  );
}

/* ============================================
   MENU ITEM FORM (Add / Edit)
   ============================================ */
function MenuItemForm({ item, token, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || "",
    category: item?.category || "dinner",
    is_happy_hour: item?.is_happy_hour || false,
    happy_hour_price: item?.happy_hour_price || "",
    sort_order: item?.sort_order || 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("is_happy_hour", form.is_happy_hour);
    formData.append("happy_hour_price", form.is_happy_hour ? form.happy_hour_price : "");
    formData.append("sort_order", form.sort_order);
    if (imageFile) formData.append("image", imageFile);

    try {
      const url = item ? `/api/menu/${item.id}` : "/api/menu";
      const method = item ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        onSaved();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-form-modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="admin-form-content">
        <div className="admin-form-header">
          <h3>{item ? "Edit Menu Item" : "Add Menu Item"}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-form-body">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Item Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} style={{ minHeight: "80px" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>Price ($) *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} step="0.01" min="0" required />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="dinner">Dinner</option>
                  <option value="drinks">Drinks</option>
                  <option value="specials">Specials</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>Sort Order</label>
                <input type="number" name="sort_order" value={form.sort_order} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label>Happy Hour Price ($)</label>
                <input
                  type="number"
                  name="happy_hour_price"
                  value={form.happy_hour_price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  disabled={!form.is_happy_hour}
                />
              </div>
            </div>

            <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <label className="toggle-switch" style={{ marginBottom: 0 }}>
                <input type="checkbox" name="is_happy_hour" checked={form.is_happy_hour} onChange={handleChange} />
                <span className="toggle-slider" />
              </label>
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Include in Happy Hour</span>
            </div>

            <div className="form-group">
              <label>Item Photo</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImageFile(e.target.files[0])}
                style={{ padding: "0.5rem 0" }}
              />
              {item?.image_url && !item.image_url.includes("default") && (
                <p style={{ fontSize: "0.8rem", color: "var(--ash)", marginTop: "0.5rem" }}>
                  Current image: {item.image_url.split("/").pop()}
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
                {saving ? "Saving..." : item ? "Update Item" : "Add Item"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose} style={{ color: "var(--charcoal)", borderColor: "var(--ash)" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Admin;
