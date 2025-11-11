const express = require('express');
const router = express.Router();
const { Equipment } = require('../../models');

// === GET → Listar todos los equipos ===
router.get('/', async (req, res) => {
  try {
    const equipments = await Equipment.findAll();
    res.json(equipments);
  } catch (error) {
    console.error('Error fetching equipments:', error);
    res.status(500).json({ error: 'Error al obtener los equipos' });
  }
});

// === POST → Registrar un nuevo equipo ===
router.post('/', async (req, res) => {
  try {
    const { type, brand, model, serial, ownerName, notes } = req.body;

    if (!type || !serial) {
      return res.status(400).json({ error: 'El tipo y el número de serie son obligatorios' });
    }

    const newEquipment = await Equipment.create({
      type,
      brand,
      model,
      serial,
      ownerName,
      notes,
    });

    res.status(201).json({
      message: '✅ Equipo registrado exitosamente',
      equipment: newEquipment,
    });
  } catch (error) {
    console.error('Error creating equipment:', error);
    res.status(500).json({ error: 'Error al registrar el equipo' });
  }
});

module.exports = router;
