const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Note = sequelize.define('Note', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
  movieId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'movies', key: 'id' }, onDelete: 'CASCADE' },
  rating: { type: DataTypes.DECIMAL(3, 2), allowNull: false, validate: { min: 0, max: 5 } },
  comment: { type: DataTypes.TEXT }
}, {
  tableName: 'notes',
  timestamps: true,
  indexes: [{ unique: true, fields: ['userId', 'movieId'] }]
});

module.exports = Note;
