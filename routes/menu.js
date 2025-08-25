import express from "express";
import pool from "../db.js";

const router = express.Router();

// Vrati sve kategorije + artikle za restoran
router.get("/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;

  const categories = await pool.query(
    "SELECT * FROM cafferesto.menu_categories WHERE restaurant_id=$1 AND is_active=true ORDER BY position",
    [restaurantId]
  );

  const items = await pool.query(
    "SELECT * FROM cafferesto.menu_items WHERE restaurant_id=$1 AND is_active=true ORDER BY position",
    [restaurantId]
  );

  // grupisanje
  const menu = categories.rows.map((cat) => ({
    ...cat,
    items: items.rows.filter((item) => item.category_id === cat.id),
  }));

  res.json(menu);
});

export default router;
