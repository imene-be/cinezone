const express = require('express');
const router = express.Router();

// Middlewares d'authentification
const { protect, isAdmin } = require('../middlewares/authenticate');

// Services
const userService = require('../services/userService');
const movieService = require('../services/movieService');
const categoryService = require('../services/categoryService');
const watchlistService = require('../services/watchlistService');
const noteService = require('../services/noteService');
const historyService = require('../services/historyService');

// Configuration automatique des routes
const configureRoutes = require('../routes/router');

configureRoutes(router, {
  userService,
  movieService,
  categoryService,
  watchlistService,
  noteService,
  historyService
}, { protect, isAdmin });

module.exports = router;
