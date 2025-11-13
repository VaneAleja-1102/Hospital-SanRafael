// backend/routes/equipments.js
const express = require("express");
const router = express.Router();
const { Equipment } = require("../../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// === Asegurar carpeta uploads ===
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// === Configuración de Multer ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Solo se permiten imágenes"));
  },
});

// === GET: Listar equipos ===
router.get("/", async (req, res) => {
  try {
    const equipments = await Equipment.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ success: true, equipments });
  } catch (error) {
    console.error("❌ Error al obtener los equipos:", error);
    res.status(500).json({ error: "Error al obtener los equipos" });
  }
});

// === POST: Registrar nuevo equipo ===
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { type, brand, model, serial, ownerName, notes } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!type || !serial) {
      return res.status(400).json({ error: "El tipo y el número de serie son obligatorios" });
    }

    const newEquipment = await Equipment.create({
      type,
      brand,
      model,
      serial,
      ownerName,
      notes,
      imageUrl,
    });

    res.status(201).json({
      message: "✅ Equipo registrado exitosamente",
      equipment: newEquipment,
    });
  } catch (error) {
    console.error("❌ Error al registrar el equipo:", error);
    res.status(500).json({ error: "Error al registrar el equipo" });
  }
});

module.exports = router;
