const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const History = sequelize.define('History', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
  movieId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'movies', key: 'id' }, onDelete: 'CASCADE' },
  action: { type: DataTypes.ENUM('view', 'rate', 'favorite', 'watchlist_add', 'watchlist_remove'), allowNull: false },
  metadata: { type: DataTypes.JSON, defaultValue: {} }
}, {
  tableName: 'histories',
  timestamps: true,
  updatedAt: false
});

module.exports = History;
