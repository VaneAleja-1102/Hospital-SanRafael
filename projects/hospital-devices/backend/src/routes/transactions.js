const express = require('express');
const router = express.Router();
const { Transaction, Equipment, User } = require('../../models');
const { authenticateToken } = require('../middlewares/auth');

// Obtener todas las transacciones (historial completo)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: Equipment,
          as: 'Equipment',
          attributes: ['id', 'type', 'brand', 'model', 'serial']
        },
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(transactions);
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({ 
      message: 'Error al obtener el historial de movimientos',
      error: error.message 
    });
  }
});

// Crear una nueva transacción
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { equipmentId, type, description } = req.body;
    const userId = req.user.id;

    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipo no encontrado' });
    }

    const transaction = await Transaction.create({
      equipmentId,
      userId,
      type, // 'Ingreso' o 'Egreso'
      description,
      registeredBy: req.user.email
    });

    const fullTransaction = await Transaction.findByPk(transaction.id, {
      include: [
        {
          model: Equipment,
          as: 'Equipment',
          attributes: ['id', 'type', 'brand', 'model', 'serial']
        },
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json(fullTransaction);
  } catch (error) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({ 
      message: 'Error al registrar el movimiento',
      error: error.message 
    });
  }
});

module.exports = router;