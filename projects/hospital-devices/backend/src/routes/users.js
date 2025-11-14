const express = require('express');
const router = express.Router();

// Importamos el array de usuarios desde auth.js
const auth = require('./auth');

// 👉 Extraemos la variable `users` que está declarada dentro de auth.js
const users = auth.users;

// GET /api/users → lista todos los usuarios registrados
router.get('/', (req, res) => {
  res.json({ users });
});

module.exports = router;
