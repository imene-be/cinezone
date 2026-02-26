import axios from 'axios';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_BASE_URL = process.env.REACT_APP_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

// Détecter si c'est un Bearer Token (JWT) ou une clé API
const isBearerToken = TMDB_API_KEY && TMDB_API_KEY.startsWith('eyJ');

// Instance axios pour TMDB
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: isBearerToken ? { language: 'fr-FR' } : {
    api_key: TMDB_API_KEY,
    language: 'fr-FR'
  },
  headers: isBearerToken ? {
    Authorization: `Bearer ${TMDB_API_KEY}`,
    'Content-Type': 'application/json'
  } : {}
});

// Rechercher des films par titre
export const searchMovies = async (query) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: { query }
    });
    return response.data.results;
  } catch (error) {
    console.error('Erreur lors de la recherche TMDB:', error);
    throw error;
  }
};

// Récupérer les détails d'un film
export const getMovieDetails = async (tmdbId) => {
  try {
    const response = await tmdbApi.get(`/movie/${tmdbId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails TMDB:', error);
    throw error;
  }
};

// Récupérer les genres TMDB
export const getGenres = async () => {
  try {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Erreur lors de la récupération des genres TMDB:', error);
    throw error;
  }
};

// Récupérer les films similaires
export const getSimilarMovies = async (tmdbId) => {
  try {
    const response = await tmdbApi.get(`/movie/${tmdbId}/similar`);
    return response.data.results;
  } catch (error) {
    console.error('Erreur lors de la récupération des films similaires:', error);
    throw error;
  }
};

// Convertir un film TMDB en format CineZone
export const convertTmdbToMovie = (tmdbMovie) => {
  return {
    title: tmdbMovie.title || '',
    description: tmdbMovie.overview || '',
    releaseDate: tmdbMovie.release_date || '',
    duration: tmdbMovie.runtime || '',
    poster: tmdbMovie.poster_path
      ? getTmdbImageUrl(tmdbMovie.poster_path, 'w500')
      : '',
    trailer: '', // TMDB ne fournit pas directement le trailer dans les détails basiques
    tmdbId: tmdbMovie.id,
    tmdbGenres: tmdbMovie.genres || tmdbMovie.genre_ids || []
  };
};

// Obtenir l'URL complète de l'image
export const getTmdbImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export default {
  searchMovies,
  getMovieDetails,
  getGenres,
  getSimilarMovies,
  convertTmdbToMovie,
  getTmdbImageUrl
};
