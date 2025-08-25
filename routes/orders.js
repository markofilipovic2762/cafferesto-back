import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * Kreiranje nove porudžbine preko QR koda
 * Body: { restaurant_id, table_number }
 */
router.post("/", async (req, res) => {
  const { restaurant_id, table_number } = req.body;

  // pronađi sto
  const table = await pool.query(
    "SELECT id FROM cafferesto.restaurant_tables WHERE restaurant_id=$1 AND broj_stola=$2",
    [restaurant_id, table_number]
  );
  if (!table.rows.length)
    return res.status(404).json({ error: "Sto ne postoji" });

  const result = await pool.query(
    `INSERT INTO cafferesto.orders (restaurant_id, table_id, status, created_at)
     VALUES ($1, $2, 'draft', NOW()) RETURNING *`,
    [restaurant_id, table.rows[0].id]
  );

  res.json(result.rows[0]);
});

/**
 * Dodaj stavku u porudžbinu
 * Body: { order_id, item_id, quantity }
 */
router.post("/add-item", async (req, res) => {
  const { order_id, item_id, quantity } = req.body;

  const result = await pool.query(
    `INSERT INTO cafferesto.order_items (order_id, item_id, quantity, price_each)
     SELECT $1, id, $3, price_rs FROM cafferesto.menu_items WHERE id=$2
     RETURNING *`,
    [order_id, item_id, quantity]
  );

  res.json(result.rows[0]);
});

/**
 * Vrati porudžbinu sa stavkama
 */
router.get("/:id", async (req, res) => {
  const order = await pool.query(
    "SELECT * FROM cafferesto.orders WHERE id=$1",
    [req.params.id]
  );
  const items = await pool.query(
    `SELECT oi.*, mi.name, mi.price_rs 
     FROM cafferesto.order_items oi 
     JOIN cafferesto.menu_items mi ON mi.id=oi.item_id
     WHERE order_id=$1`,
    [req.params.id]
  );

  res.json({ ...order.rows[0], items: items.rows });
});

/**
 * Ažuriraj status porudžbine
 * Body: { status }
 */
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;

  const result = await pool.query(
    "UPDATE cafferesto.orders SET status=$1 WHERE id=$2 RETURNING *",
    [status, req.params.id]
  );

  res.json(result.rows[0]);
});

export default router;
