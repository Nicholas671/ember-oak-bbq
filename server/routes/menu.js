const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../db");
const authenticateToken = require("../middleware/auth");
const cache = require("../middleware/cache");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads", "menu");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed."));
    }
  },
});

// GET /api/menu — all available menu items (public, cached 60s)
router.get("/", cache(60), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM menu_items WHERE is_available = TRUE ORDER BY category, sort_order, name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get menu error:", err);
    res.status(500).json({ error: "Failed to fetch menu." });
  }
});

// GET /api/menu/all — all items including unavailable (admin)
router.get("/all", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM menu_items ORDER BY category, sort_order, name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get all menu error:", err);
    res.status(500).json({ error: "Failed to fetch menu." });
  }
});

// GET /api/menu/category/:category — items by category (public, cached 60s)
router.get("/category/:category", cache(60), async (req, res) => {
  try {
    const { category } = req.params;
    const validCategories = ["dinner", "drinks", "specials"];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category." });
    }

    const result = await pool.query(
      `SELECT * FROM menu_items WHERE category = $1 AND is_available = TRUE ORDER BY sort_order, name`,
      [category]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get category error:", err);
    res.status(500).json({ error: "Failed to fetch category." });
  }
});

// GET /api/menu/happy-hour — happy hour items (public, cached 60s)
router.get("/happy-hour", cache(60), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM menu_items WHERE is_happy_hour = TRUE AND is_available = TRUE ORDER BY category, sort_order, name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get happy hour error:", err);
    res.status(500).json({ error: "Failed to fetch happy hour items." });
  }
});

// POST /api/menu — create a new menu item (admin)
router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, is_happy_hour, happy_hour_price, sort_order } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: "Name, price, and category are required." });
    }

    const image_url = req.file ? `/uploads/menu/${req.file.filename}` : "/images/default-dish.jpg";

    const result = await pool.query(
      `INSERT INTO menu_items (name, description, price, category, image_url, is_happy_hour, happy_hour_price, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        name,
        description || null,
        parseFloat(price),
        category,
        image_url,
        is_happy_hour === "true" || is_happy_hour === true,
        happy_hour_price ? parseFloat(happy_hour_price) : null,
        sort_order ? parseInt(sort_order) : 0,
      ]
    );

    cache.clear("/api/menu");
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create item error:", err);
    res.status(500).json({ error: "Failed to create menu item." });
  }
});

// PUT /api/menu/:id — update a menu item (admin)
router.put("/:id", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, is_happy_hour, happy_hour_price, is_available, sort_order } = req.body;

    // Get current item to check if it exists
    const current = await pool.query("SELECT * FROM menu_items WHERE id = $1", [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found." });
    }

    const image_url = req.file
      ? `/uploads/menu/${req.file.filename}`
      : current.rows[0].image_url;

    const result = await pool.query(
      `UPDATE menu_items SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        category = COALESCE($4, category),
        image_url = $5,
        is_happy_hour = COALESCE($6, is_happy_hour),
        happy_hour_price = $7,
        is_available = COALESCE($8, is_available),
        sort_order = COALESCE($9, sort_order),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 RETURNING *`,
      [
        name || null,
        description !== undefined ? description : null,
        price ? parseFloat(price) : null,
        category || null,
        image_url,
        is_happy_hour !== undefined ? (is_happy_hour === "true" || is_happy_hour === true) : null,
        happy_hour_price ? parseFloat(happy_hour_price) : null,
        is_available !== undefined ? (is_available === "true" || is_available === true) : null,
        sort_order ? parseInt(sort_order) : null,
        id,
      ]
    );

    cache.clear("/api/menu");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update item error:", err);
    res.status(500).json({ error: "Failed to update menu item." });
  }
});

// PATCH /api/menu/:id/happy-hour — toggle happy hour (admin)
router.patch("/:id/happy-hour", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_happy_hour, happy_hour_price } = req.body;

    const result = await pool.query(
      `UPDATE menu_items SET
        is_happy_hour = $1,
        happy_hour_price = $2,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING *`,
      [is_happy_hour, happy_hour_price || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found." });
    }

    cache.clear("/api/menu");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Toggle happy hour error:", err);
    res.status(500).json({ error: "Failed to toggle happy hour." });
  }
});

// PATCH /api/menu/:id/availability — toggle availability (admin)
router.patch("/:id/availability", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;

    const result = await pool.query(
      `UPDATE menu_items SET is_available = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [is_available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found." });
    }

    cache.clear("/api/menu");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Toggle availability error:", err);
    res.status(500).json({ error: "Failed to toggle availability." });
  }
});

// DELETE /api/menu/:id — delete a menu item (admin)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get the item first to delete its image
    const current = await pool.query("SELECT image_url FROM menu_items WHERE id = $1", [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found." });
    }

    // Delete the image file if it's not the default
    const imageUrl = current.rows[0].image_url;
    if (imageUrl && !imageUrl.includes("default-dish")) {
      const imagePath = path.join(__dirname, "..", imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await pool.query("DELETE FROM menu_items WHERE id = $1", [id]);
    cache.clear("/api/menu");
    res.json({ message: "Menu item deleted successfully." });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ error: "Failed to delete menu item." });
  }
});

module.exports = router;
