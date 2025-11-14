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

// === Configuración Multer ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const okMime = allowed.test(file.mimetype);
    const okExt = allowed.test(path.extname(file.originalname).toLowerCase());
    if (okMime && okExt) return cb(null, true);
    cb(new Error("Solo se permiten imágenes"));
  },
});

// ===============================
// GET: LISTAR EQUIPOS
// ===============================
router.get("/", async (req, res) => {
  try {
    const equipments = await Equipment.findAll({
      order: [["createdAt", "DESC"]],
    });

    // Convertir rutas relativas a absolutas
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const ready = equipments.map((e) => ({
      ...e.toJSON(),
      imageUrl: e.imageUrl ? `${baseUrl}${e.imageUrl}` : null,
    }));

    res.json({ success: true, equipments: ready });
  } catch (error) {
    console.error("❌ Error al obtener los equipos:", error);
    res.status(500).json({ error: "Error al obtener los equipos" });
  }
});

// ===============================
// POST: CREAR EQUIPO
// ===============================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { type, brand, model, serial, ownerName, notes, isBiomedical } = req.body;

    if (!type || !serial) {
      return res.status(400).json({ error: "Tipo y número de serie son obligatorios" });
    }

    // Multer guardó: "/uploads/archivo.jpg"
    const relativeImageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const fullImageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    const newEquipment = await Equipment.create({
      type,
      brand,
      model,
      serial,
      ownerName,
      notes,
      isBiomedical: isBiomedical === "true" || isBiomedical === true,
      imageUrl: relativeImageUrl, // guardamos RELATIVA en DB (correcto)
    });

    res.status(201).json({
      message: "✅ Equipo registrado exitosamente",
      equipment: {
        ...newEquipment.toJSON(),
        imageUrl: fullImageUrl, // enviamos ABSOLUTA al frontend
      },
    });
  } catch (error) {
    console.error("❌ Error al registrar el equipo:", error);
    res.status(500).json({ error: "Error al registrar el equipo" });
  }
});

module.exports = router;
