const History = require('../models/historyModel');
const Movie = require('../models/movieModel');

exports.getUserHistory = async (userId, options = {}) => {
  const {
    page = 1,
    limit = 20,
    action
  } = options;

  const offset = (page - 1) * limit;
  const where = { userId };

  if (action) {
    where.action = action;
  }

  const { count, rows } = await History.findAndCountAll({
    where,
    include: [{
      model: Movie,
      as: 'movie',
      attributes: ['id', 'title', 'poster', 'releaseDate']
    }],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']]
  });

  return {
    history: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    }
  };
};

exports.addHistoryEntry = async (userId, movieId, action, metadata = {}) => {
  return await History.create({
    userId,
    movieId,
    action,
    metadata
  });
};