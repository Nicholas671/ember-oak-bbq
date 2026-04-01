const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

// GET /api/admin/popup — get popup settings (public, needed for landing page)
router.get("/popup", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM site_settings WHERE setting_key IN ('landing_popup', 'popup_title')"
    );

    const settings = {};
    result.rows.forEach((row) => {
      settings[row.setting_key] = {
        value: row.setting_value,
        is_active: row.is_active,
      };
    });

    res.json(settings);
  } catch (err) {
    console.error("Get popup error:", err);
    res.status(500).json({ error: "Failed to fetch popup settings." });
  }
});

// PUT /api/admin/popup — update popup settings (admin)
router.put("/popup", authenticateToken, async (req, res) => {
  try {
    const { title, message, is_active } = req.body;

    if (title !== undefined) {
      await pool.query(
        "UPDATE site_settings SET setting_value = $1, updated_at = CURRENT_TIMESTAMP WHERE setting_key = 'popup_title'",
        [title]
      );
    }

    if (message !== undefined) {
      await pool.query(
        "UPDATE site_settings SET setting_value = $1, updated_at = CURRENT_TIMESTAMP WHERE setting_key = 'landing_popup'",
        [message]
      );
    }

    if (is_active !== undefined) {
      await pool.query(
        "UPDATE site_settings SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE setting_key = 'landing_popup'",
        [is_active]
      );
    }

    // Return updated settings
    const result = await pool.query(
      "SELECT * FROM site_settings WHERE setting_key IN ('landing_popup', 'popup_title')"
    );

    const settings = {};
    result.rows.forEach((row) => {
      settings[row.setting_key] = {
        value: row.setting_value,
        is_active: row.is_active,
      };
    });

    res.json(settings);
  } catch (err) {
    console.error("Update popup error:", err);
    res.status(500).json({ error: "Failed to update popup settings." });
  }
});

// GET /api/admin/settings — get all site settings (admin)
router.get("/settings", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM site_settings ORDER BY setting_key");
    res.json(result.rows);
  } catch (err) {
    console.error("Get settings error:", err);
    res.status(500).json({ error: "Failed to fetch settings." });
  }
});

// PUT /api/admin/settings/:key — update a specific setting (admin)
router.put("/settings/:key", authenticateToken, async (req, res) => {
  try {
    const { key } = req.params;
    const { value, is_active } = req.body;

    const result = await pool.query(
      `UPDATE site_settings SET
        setting_value = COALESCE($1, setting_value),
        is_active = COALESCE($2, is_active),
        updated_at = CURRENT_TIMESTAMP
       WHERE setting_key = $3 RETURNING *`,
      [value, is_active, key]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Setting not found." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update setting error:", err);
    res.status(500).json({ error: "Failed to update setting." });
  }
});

module.exports = router;
