'use strict';

module.exports = (sequelize, DataTypes) => {
  const Equipment = sequelize.define('Equipment', {
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    brand: DataTypes.STRING,
    model: DataTypes.STRING,
    serial: DataTypes.STRING,
    ownerName: DataTypes.STRING,
    notes: DataTypes.TEXT,
    isBiomedical: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    equipmentType: DataTypes.STRING,
    imageUrl: DataTypes.STRING // ✅ nombre correcto y consistente con el backend
  }, {
    tableName: 'equipments',
    timestamps: true
  });

  Equipment.associate = (models) => {
    Equipment.hasMany(models.Transaction, {
      foreignKey: 'equipmentId',
      as: 'transactions'
    });
  };

  return Equipment;
};
