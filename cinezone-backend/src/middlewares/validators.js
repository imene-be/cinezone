const { body, param, query, validationResult } = require('express-validator');

// Middleware pour gérer les erreurs de validation
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Erreur de validation',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// ===================== AUTH VALIDATORS =====================
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/\d/)
    .withMessage('Le mot de passe doit contenir au moins un chiffre'),
  body('firstName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Le prénom doit contenir au moins 2 caractères')
    .escape(),
  body('lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Le nom doit contenir au moins 2 caractères')
    .escape(),
  handleValidation
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
  handleValidation
];

// ===================== MOVIE VALIDATORS =====================
const createMovieValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Le titre est requis')
    .isLength({ max: 200 })
    .withMessage('Le titre ne peut pas dépasser 200 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('La description ne peut pas dépasser 5000 caractères'),
  body('releaseDate')
    .optional()
    .isISO8601()
    .withMessage('Date de sortie invalide'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('La durée doit être entre 1 et 1000 minutes'),
  body('trailer')
    .optional()
    .isURL()
    .withMessage('URL de bande-annonce invalide'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Statut invalide'),
  handleValidation
];

const updateMovieValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de film invalide'),
  ...createMovieValidation.slice(0, -1), // Réutilise les règles sans le handleValidation
  handleValidation
];

const movieIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de film invalide'),
  handleValidation
];

// ===================== CATEGORY VALIDATORS =====================
const createCategoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom de la catégorie est requis')
    .isLength({ max: 100 })
    .withMessage('Le nom ne peut pas dépasser 100 caractères'),
  body('slug')
    .optional()
    .trim()
    .isSlug()
    .withMessage('Le slug est invalide'),
  handleValidation
];

const updateCategoryValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de catégorie invalide'),
  ...createCategoryValidation.slice(0, -1),
  handleValidation
];

const categoryIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de catégorie invalide'),
  handleValidation
];

// ===================== USER VALIDATORS =====================
const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Le prénom doit contenir au moins 2 caractères')
    .escape(),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Le nom doit contenir au moins 2 caractères')
    .escape(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  handleValidation
];

const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Le mot de passe actuel est requis'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
    .matches(/\d/)
    .withMessage('Le mot de passe doit contenir au moins un chiffre'),
  handleValidation
];

const userIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID utilisateur invalide'),
  handleValidation
];

// ===================== WATCHLIST VALIDATORS =====================
const watchlistValidation = [
  body('movieId')
    .isInt({ min: 1 })
    .withMessage('ID de film invalide'),
  handleValidation
];

const watchlistParamValidation = [
  param('movieId')
    .isInt({ min: 1 })
    .withMessage('ID de film invalide'),
  handleValidation
];

// ===================== NOTE VALIDATORS =====================
const createNoteValidation = [
  body('movieId')
    .isInt({ min: 1 })
    .withMessage('ID de film invalide'),
  body('rating')
    .isFloat({ min: 0, max: 5 })
    .withMessage('La note doit être entre 0 et 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Le commentaire ne peut pas dépasser 1000 caractères'),
  handleValidation
];

const updateNoteValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de note invalide'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('La note doit être entre 0 et 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Le commentaire ne peut pas dépasser 1000 caractères'),
  handleValidation
];

const noteIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de note invalide'),
  handleValidation
];

// ===================== QUERY VALIDATORS =====================
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page invalide'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage('Limite invalide (1-500)'),
  query('minRating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Note minimum invalide'),
  handleValidation
];

module.exports = {
  handleValidation,
  // Auth
  registerValidation,
  loginValidation,
  // Movies
  createMovieValidation,
  updateMovieValidation,
  movieIdValidation,
  // Categories
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
  // Users
  updateProfileValidation,
  updatePasswordValidation,
  userIdValidation,
  // Watchlist
  watchlistValidation,
  watchlistParamValidation,
  // Notes
  createNoteValidation,
  updateNoteValidation,
  noteIdValidation,
  // Queries
  paginationValidation
};
