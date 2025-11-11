'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: { allowNull:false, autoIncrement:true, primaryKey:true, type:Sequelize.INTEGER },
      googleId: { type: Sequelize.STRING, allowNull: false, unique: true },
      name: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      picture: { type: Sequelize.STRING },
      role: { type: Sequelize.STRING, defaultValue: 'user' },
      lastLoginAt: { type: Sequelize.DATE },
      createdAt: { allowNull:false, type:Sequelize.DATE },
      updatedAt: { allowNull:false, type:Sequelize.DATE }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
