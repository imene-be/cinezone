const User = require('./userModel');
const Movie = require('./movieModel');
const Category = require('./categoryModel');
const Watchlist = require('./watchlistModel');
const Note = require('./noteModel');
const History = require('./historyModel');

// User ↔ Movie (via Watchlist - Many-to-Many)
User.belongsToMany(Movie, { 
  through: Watchlist, 
  foreignKey: 'userId',
  as: 'watchlistMovies'
});

Movie.belongsToMany(User, { 
  through: Watchlist, 
  foreignKey: 'movieId',
  as: 'watchlistedBy'
});

// User → Note ← Movie
User.hasMany(Note, { foreignKey: 'userId', as: 'notes' });
Movie.hasMany(Note, { foreignKey: 'movieId', as: 'notes' });
Note.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Note.belongsTo(Movie, { foreignKey: 'movieId', as: 'movie' });

// User → History → Movie
User.hasMany(History, { foreignKey: 'userId', as: 'history' });
History.belongsTo(User, { foreignKey: 'userId', as: 'user' });
History.belongsTo(Movie, { foreignKey: 'movieId', as: 'movie' });

// Category ↔ Movie (Many-to-Many)
const { sequelize } = require('../utils/db');

const MovieCategory = sequelize.define('MovieCategory', {}, {
  tableName: 'movie_categories',
  timestamps: false
});

Movie.belongsToMany(Category, { 
  through: MovieCategory, 
  foreignKey: 'movieId',
  as: 'categories' 
});

Category.belongsToMany(Movie, { 
  through: MovieCategory, 
  foreignKey: 'categoryId',
  as: 'movies' 
});

module.exports = {
  User,
  Movie,
  Category,
  Watchlist,
  Note,
  History,
  MovieCategory
};