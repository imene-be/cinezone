const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Watchlist = sequelize.define('Watchlist', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
  movieId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'movies', key: 'id' }, onDelete: 'CASCADE' }
}, {
  tableName: 'watchlists',
  timestamps: true,
  indexes: [{ unique: true, fields: ['userId', 'movieId'] }]
});

module.exports = Watchlist;
