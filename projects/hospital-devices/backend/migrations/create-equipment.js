// backend/migrations/0001-create-equipments.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('equipments', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      type: { type: Sequelize.STRING, allowNull: false },
      brand: { type: Sequelize.STRING },
      model: { type: Sequelize.STRING },
      serial: { type: Sequelize.STRING },
      ownerName: { type: Sequelize.STRING },
      notes: { type: Sequelize.TEXT },
      isBiomedical: { type: Sequelize.BOOLEAN, defaultValue: false },
      equipmentType: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('equipments');
  }
};
