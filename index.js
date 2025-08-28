import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

import restaurantRoutes from "./routes/restaurants.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";

const app = express();
app.use(cors());
app.use(express.json());

// Putanja do foldera sa slikama
const __dirname = path.resolve();
const imagesPath = path.join(__dirname, "images");

// Serviranje foldera kao static
app.use("/images/", express.static(imagesPath));

// Konfiguracija gde i kako čuvati fajlove
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesPath); // folder images
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// POST ruta za upload
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nijedna slika nije poslata" });
  }
  res.json({
    message: "Upload uspešan!",
    file: `/images/${req.file.filename}`,
  });
});

// app.get("/images/:id", (req, res) => {
//   const id = req.params.id;
//   const filePath = path.join(imagesPath, `${id}.jpg`);
//   res.sendFile(filePath, (err) => {
//     if (err) {
//       res.status(404).send("Slika nije pronađena");
//     }
//   });
// });

// Rute
app.use("/restaurants", restaurantRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);

app.listen(5000, "0.0.0.0", () => {
  console.log("✅ CaffeResto backend running on http://localhost:5000");
});
