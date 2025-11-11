// backend/models/transaction.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    equipmentId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: true }, // Agregar esta línea
    type: { type: DataTypes.STRING, allowNull: false }, // "Ingreso" | "Egreso"
    description: DataTypes.TEXT,
    registeredBy: DataTypes.STRING,
    isWorking: { type: DataTypes.BOOLEAN, defaultValue: true },
    photoUrl: DataTypes.TEXT,
    entryTransactionId: DataTypes.INTEGER
  }, {
    tableName: 'transactions',
    timestamps: true
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Equipment, { foreignKey: 'equipmentId', as: 'Equipment' });
    Transaction.belongsTo(models.User, { foreignKey: 'userId', as: 'User' }); // Agregar esta línea
  };

  return Transaction;
};