const Note = require('../models/noteModel');
const Movie = require('../models/movieModel');
const History = require('../models/historyModel');
const { sequelize } = require('../utils/db');

exports.getUserNotes = async (userId) => {
  return await Note.findAll({
    where: { userId },
    include: [{
      model: Movie,
      as: 'movie',
      attributes: ['id', 'title', 'poster']
    }],
    order: [['createdAt', 'DESC']]
  });
};

exports.getMovieNotes = async (movieId) => {
  return await Note.findAll({
    where: { movieId },
    attributes: { exclude: ['userId'] },
    order: [['createdAt', 'DESC']]
  });
};

exports.createOrUpdateNote = async (userId, noteData) => {
  const { movieId, rating, comment } = noteData;

  if (!movieId) {
    throw new Error("movieId manquant");
  }

  const movie = await Movie.findByPk(movieId);
  if (!movie) {
    throw new Error("Film non trouvé");
  }

  const [note, created] = await Note.findOrCreate({
    where: { userId, movieId },
    defaults: { rating, comment }
  });

  if (!created) {
    await note.update({ rating, comment });
  }

  await updateMovieAverageRating(movieId);

  await History.create({
    userId,
    movieId,
    action: "rate",
    metadata: { rating, comment }
  });

  return {
    note: note.toJSON(),
    message: created ? 'Note créée avec succès' : 'Note mise à jour avec succès',
    created
  };
};


exports.updateNote = async (userId, noteId, updateData) => {
  const note = await Note.findOne({
    where: { id: noteId, userId }
  });

  if (!note) {
    throw new Error('Note non trouvée');
  }

  const { rating, comment } = updateData;
  await note.update({ rating, comment });

  await updateMovieAverageRating(note.movieId);

  return note;
};

exports.deleteNote = async (userId, noteId) => {
  const note = await Note.findOne({
    where: { id: noteId, userId }
  });

  if (!note) {
    throw new Error('Note non trouvée');
  }

  const movieId = note.movieId;
  await note.destroy();

  await updateMovieAverageRating(movieId);

  return { message: 'Note supprimée avec succès' };
};

const updateMovieAverageRating = async (movieId) => {
  const result = await Note.findOne({
    where: { movieId },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    raw: true
  });

  const movie = await Movie.findByPk(movieId);
  await movie.update({
    averageRating: parseFloat(result.avgRating) || 0,
    ratingsCount: parseInt(result.count) || 0
  });
};