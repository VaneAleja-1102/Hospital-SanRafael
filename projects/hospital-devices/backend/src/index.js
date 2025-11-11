require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('../models');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;

// === MIDDLEWARES ===
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === JWT Middleware ===
const verifyJwt = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT error:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// === ROUTES ===
const authRouter = require('./routes/auth');
const equipmentsRouter = require('./routes/equipments');
const transactionsRouter = require('./routes/transactions'); // 👈 nombre corregido según tu archivo real

app.use('/api/auth', authRouter);
app.use('/api/equipments', verifyJwt, equipmentsRouter);
app.use('/api/transactions', verifyJwt, transactionsRouter);

// === RUTA DE PRUEBA JWT ===
app.get('/api/protected', verifyJwt, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// === RUTA PRINCIPAL ===
app.get('/', (req, res) => {
  res.json({ ok: true, message: '✅ Hospital Devices API funcionando correctamente' });
});

// === SERVER START ===
app.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected successfully');
  } catch (err) {
    console.error('❌ DB connection failed:', err);
  }
});
