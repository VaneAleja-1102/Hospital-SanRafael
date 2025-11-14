const express = require("express");
const router = express.Router();
const { User } = require("../../models");
const { authenticateToken } = require("../middlewares/auth");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email"]
    });

    res.json({ users });
  } catch (error) {
    console.error("❌ Error cargando usuarios:", error);
    res.status(500).json({ error: "Error al cargar usuarios" });
  }
});

module.exports = router;
