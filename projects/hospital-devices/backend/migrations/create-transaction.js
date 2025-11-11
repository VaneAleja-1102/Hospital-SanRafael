// backend/migrations/0002-create-transactions.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      equipmentId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'equipments', key: 'id' }, onDelete: 'CASCADE' },
      type: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      registeredBy: { type: Sequelize.STRING },
      isWorking: { type: Sequelize.BOOLEAN, defaultValue: true },
      photoUrl: { type: Sequelize.TEXT },
      entryTransactionId: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transactions');
  }
};
