const express = require("express");
const router = express.Router();
const { Transaction, Equipment, User } = require("../../models");
const { authenticateToken } = require("../middlewares/auth");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

// === Helper: guardar imagen base64
function saveBase64Image(base64String) {
  try {
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return null;

    const ext = matches[1].split("/")[1];
    const data = matches[2];
    const buffer = Buffer.from(data, "base64");

    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${ext}`;
    const filepath = path.join(__dirname, "../../uploads", filename);

    fs.writeFileSync(filepath, buffer);

    return `/uploads/${filename}`;
  } catch (err) {
    console.error("❌ Error guardando imagen:", err);
    return null;
  }
}

// ============================
// HISTORIAL COMPLETO
// ============================
router.get("/", authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: Equipment,
          as: "Equipment",
          attributes: ["id", "type", "brand", "model", "serial", "imageUrl"],
        },
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================
// PENDING ENTRIES
// ============================
router.get("/pending-entries", authenticateToken, async (req, res) => {
  try {
    const { equipmentId } = req.query;

    const ingresos = await Transaction.findAll({
      where: { type: "Ingreso" },
      include: [
        { model: Equipment, as: "Equipment" },
        { model: User, as: "User" },
      ],
      order: [["createdAt", "DESC"]],
    });

    const result = [];

    for (const ingreso of ingresos) {
      const existeEgreso = await Transaction.findOne({
        where: {
          equipmentId: ingreso.equipmentId,
          type: "Egreso",
          createdAt: { [Op.gt]: ingreso.createdAt },
        },
      });

      if (!existeEgreso) {
        if (!equipmentId || ingreso.equipmentId == equipmentId) {
          result.push(ingreso);
        }
      }
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================
// CREAR TRANSACCIÓN
// ============================
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      equipmentId,
      type,
      userId,
      registeredBy,
      description,
      isWorking,
      photoUrl,
      entryTransactionId,
    } = req.body;

    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    let savedPhoto = null;
    if (photoUrl) {
      savedPhoto = saveBase64Image(photoUrl);
    }

    const transaction = await Transaction.create({
      equipmentId,
      userId,
      type,
      registeredBy,
      description,
      isWorking,
      photoUrl: savedPhoto,
      entryTransactionId,
    });

    const fullTransaction = await Transaction.findByPk(transaction.id, {
      include: [
        { model: Equipment, as: "Equipment" },
        { model: User, as: "User" },
      ],
    });

    res.status(201).json(fullTransaction);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
