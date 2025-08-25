import express from "express";
import cors from "cors";

import restaurantRoutes from "./routes/restaurants.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rute
app.use("/restaurants", restaurantRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);

app.listen(5000, "0.0.0.0", () => {
  console.log("✅ CaffeResto backend running on http://localhost:5000");
});
