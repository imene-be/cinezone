const Watchlist = require('../models/watchlistModel');
const Movie = require('../models/movieModel');
const History = require('../models/historyModel');

exports.getUserWatchlist = async (userId) => {
  const User = require('../models/userModel');

  const user = await User.findByPk(userId, {
    include: [{
      model: Movie,
      as: 'watchlistMovies',
      attributes: ['id', 'title', 'poster', 'releaseDate', 'averageRating'],
      through: { attributes: ['createdAt'] }
    }]
  });

  // Transformer les données pour le frontend
  const watchlist = (user.watchlistMovies || []).map(movie => ({
    movieId: {
      _id: movie.id,
      id: movie.id,
      title: movie.title,
      poster: movie.poster,
      releaseDate: movie.releaseDate,
      averageRating: movie.averageRating
    },
    createdAt: movie.Watchlist.createdAt
  }));

  return { watchlist };
};

exports.addToWatchlist = async (userId, movieId) => {
  const movie = await Movie.findByPk(movieId);
  if (!movie) {
    throw new Error('Film non trouvé');
  }

  const existing = await Watchlist.findOne({
    where: { userId, movieId }
  });

  if (existing) {
    throw new Error('Film déjà dans la watchlist');
  }

  const watchlistItem = await Watchlist.create({ userId, movieId });

  await History.create({
    userId,
    movieId,
    action: 'watchlist_add'
  });

  // Retourner le format attendu par le frontend
  return {
    watchlist: {
      movieId: {
        _id: movie.id,
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        releaseDate: movie.releaseDate,
        averageRating: movie.averageRating
      },
      createdAt: watchlistItem.createdAt
    }
  };
};

exports.removeFromWatchlist = async (userId, movieId) => {
  const watchlistItem = await Watchlist.findOne({
    where: { userId, movieId }
  });

  if (!watchlistItem) {
    throw new Error('Film non trouvé dans la watchlist');
  }

  await watchlistItem.destroy();

  await History.create({
    userId,
    movieId,
    action: 'watchlist_remove'
  });

  return { message: 'Film retiré de la watchlist' };
};