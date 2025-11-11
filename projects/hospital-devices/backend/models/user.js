'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    googleId: { type: DataTypes.STRING, allowNull: true, unique: true },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    picture: DataTypes.STRING,
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    lastLoginAt: DataTypes.DATE
  }, {});
  
  User.associate = function(models) {
    User.hasMany(models.Transaction, { foreignKey: 'userId', as: 'transactions' });
  };
  
  return User;
};