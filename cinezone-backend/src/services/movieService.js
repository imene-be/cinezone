const Movie = require('../models/movieModel');
const Category = require('../models/categoryModel');
const { Op } = require('sequelize');
const path = require('node:path');

exports.getAllMovies = async (filters = {}) => {
  const {
    page = 1,
    limit = 20,
    category,
    minRating,
    search,
    sortBy = 'createdAt',
    order = 'DESC',
    includeAllStatus = false
  } = filters;

  const offset = (page - 1) * limit;

  const where = includeAllStatus ? {} : { status: 'published' };

  if (minRating) {
    where.averageRating = { [Op.gte]: parseFloat(minRating) };
  }

  if (search) {
    where.title = { [Op.like]: `%${search}%` };
  }

  const include = [{
    model: Category,
    as: 'categories',
    attributes: ['id', 'name', 'slug'],
    through: { attributes: [] }
  }];

  if (category) {
    include[0].where = { slug: category };
    include[0].required = true;
  }

  const { count, rows } = await Movie.findAndCountAll({
    where,
    include,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[sortBy, order]],
    distinct: true
  });
  
  return {
    movies: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    }
  };
};

exports.getMovieById = async (movieId) => {
  const movie = await Movie.findByPk(movieId, {
    include: [
      {
        model: Category,
        as: 'categories',
        attributes: ['id', 'name', 'slug'],
        through: { attributes: [] }
      }
    ]
  });

  if (!movie) {
    throw new Error('Film non trouvé');
  }

  return movie;
};

exports.createMovie = async (movieData, file) => {
  const { categories, posterUrl, ...movieInfo } = movieData || {};

  // Priorité: fichier uploadé > URL TMDB
  if (file) {
    movieInfo.poster = `/uploads/${file.filename}`;
  } else if (posterUrl) {
    movieInfo.poster = posterUrl;
  }

  const movie = await Movie.create(movieInfo);

  if (categories) {
    // Parse categories si c'est une chaîne JSON
    const categoryIds = typeof categories === 'string' ? JSON.parse(categories) : categories;
    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      await movie.setCategories(categoryIds);
    }
  }

  return await exports.getMovieById(movie.id);
};

exports.updateMovie = async (movieId, movieData, file) => {
  const movie = await Movie.findByPk(movieId);

  if (!movie) {
    throw new Error('Film non trouvé');
  }

  const { categories, posterUrl, ...movieInfo} = movieData || {};

  // Priorité: fichier uploadé > URL TMDB > conserver l'ancien
  if (file) {
    movieInfo.poster = `/uploads/${file.filename}`;
  } else if (posterUrl) {
    movieInfo.poster = posterUrl;
  }

  await movie.update(movieInfo);

  if (categories) {
    // Parse categories si c'est une chaîne JSON
    const categoryIds = typeof categories === 'string' ? JSON.parse(categories) : categories;
    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      await movie.setCategories(categoryIds);
    }
  }

  return await exports.getMovieById(movie.id);
};

exports.deleteMovie = async (movieId) => {
  const movie = await Movie.findByPk(movieId);

  if (!movie) {
    throw new Error('Film non trouvé');
  }

  await movie.destroy();

  return { message: 'Film supprimé avec succès' };
};

