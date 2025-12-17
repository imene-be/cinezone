const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  slug: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT }
}, {
  tableName: 'categories',
  timestamps: true
});

module.exports = Category;
