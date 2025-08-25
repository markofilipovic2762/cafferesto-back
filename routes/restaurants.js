import express from "express";
import pool from "../db.js";

const router = express.Router();

// Lista svih restorana
router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM cafferesto.restaurants WHERE is_active=true"
  );
  res.json(result.rows);
});

// Restoran po ID
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM cafferesto.restaurants WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// Stolovi restorana
router.get("/:id/tables", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM cafferesto.restaurant_tables WHERE restaurant_id=$1 AND is_active=true ORDER BY broj_stola",
    [req.params.id]
  );
  res.json(result.rows);
});

export default router;
