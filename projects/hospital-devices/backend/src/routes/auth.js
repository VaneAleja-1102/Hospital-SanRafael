// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();

// =================== CONFIGURACIÓN ===================
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiar-en-produccion';
const GOOGLE_CLIENT_ID = '815972207565-etag6mup0ekbg4crmfvpauqejb00936e.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ⚠️ Base de datos temporal en memoria (solo para pruebas)
let users = [];

// =================== REGISTRO ===================
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    if (password.length < 6)
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });

    const existingUser = users.find(u => u.email === email);
    if (existingUser)
      return res.status(400).json({ error: 'El email ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      authProvider: 'email',
      createdAt: new Date()
    };

    users.push(newUser);
    console.log('✅ Usuario registrado:', email);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: newUser.id, email: newUser.email, name: newUser.name }
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// =================== LOGIN ===================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });

    const user = users.find(u => u.email === email);
    if (!user)
      return res.status(401).json({ error: 'Usuario no encontrado. Regístrate primero.' });

    if (user.authProvider === 'google')
      return res.status(401).json({ error: 'Esta cuenta usa Google. Inicia sesión con Google' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// =================== LOGIN CON GOOGLE ===================
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken)
      return res.status(400).json({ error: 'Token de Google requerido' });

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = users.find(u => u.email === email);

    if (!user) {
      user = { id: Date.now().toString(), googleId, email, name, picture, authProvider: 'google', createdAt: new Date() };
      users.push(user);
      console.log('✅ Usuario creado con Google:', email);
    } else {
      console.log('✅ Usuario existente logueado con Google:', email);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email, name, picture } });
  } catch (error) {
    console.error('❌ Error en login de Google:', error);
    res.status(401).json({ error: 'Token de Google inválido' });
  }
});

// =================== VERIFICAR TOKEN ===================
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    res.json({ id: user.id, email: user.email, name: user.name, picture: user.picture });
  } catch (error) {
    console.error('❌ Token inválido:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

module.exports = router;
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
