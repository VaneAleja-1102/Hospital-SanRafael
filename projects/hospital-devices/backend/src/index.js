require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("../models");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

// === 🌐 CORS ===
app.use(
  cors({
    origin: "*", // En producción Render usa dominio distinto
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === 🖼️ SERVIR ARCHIVOS SUBIDOS ===
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// === 🔐 JWT Middleware ===
const verifyJwt = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// === ROUTES ===
const authRouter = require("./routes/auth");
const equipmentsRouter = require("./routes/equipments");
const transactionsRouter = require("./routes/transactions");

app.use("/api/auth", authRouter);
app.use("/api/equipments", verifyJwt, equipmentsRouter);
app.use("/api/transactions", verifyJwt, transactionsRouter);


// === START SERVER ===
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("🟢 DB connected");
  } catch (err) {
    console.error("🔴 DB connection error:", err);
  }
});
