const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Movie = sequelize.define('Movie', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT },
  releaseDate: { type: DataTypes.DATE },
  duration: { type: DataTypes.INTEGER, comment: 'Durée en minutes' },
  poster: { type: DataTypes.STRING(500), comment: "URL de l'affiche" },
  trailer: { type: DataTypes.STRING(500), comment: "URL de la bande-annonce" },
  status: { type: DataTypes.ENUM('draft', 'published', 'archived'), defaultValue: 'published' },
  averageRating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0.00, validate: { min: 0, max: 5 } },
  ratingsCount: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'movies',
  timestamps: true
});

module.exports = Movie;
