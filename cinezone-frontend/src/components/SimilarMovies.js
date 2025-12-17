import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { searchMovies, getTmdbImageUrl, getMovieDetails, convertTmdbToMovie } from '../utils/tmdb';
import { categories as categoriesApi, admin } from '../utils/api';
import Card from './Card';

const SimilarMovies = ({ movieTitle, movieCategories }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await categoriesApi.getAll();
        setCategories(cats.categories || cats || []);
      } catch (error) {
        console.error('Erreur chargement catégories:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      if (!movieTitle) return;

      try {
        setLoading(true);
        // Rechercher des films similaires via TMDB
        const results = await searchMovies(movieTitle);

        // Filtrer pour exclure le film actuel et limiter à 6 résultats
        const filtered = results
          .filter(m => m.title.toLowerCase() !== movieTitle.toLowerCase())
          .slice(0, 6);

        setSimilarMovies(filtered);
      } catch (error) {
        console.error('Erreur lors de la récupération des films similaires:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarMovies();
  }, [movieTitle]);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  if (similarMovies.length === 0) {
    return null;
  }

  return (
    <div className={`py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Films similaires
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {similarMovies.map((movie) => (
            <Card
              key={movie.id}
              hover
              onClick={async () => {
                try {
                  // Récupérer les détails complets du film depuis TMDB
                  const details = await getMovieDetails(movie.id);
                  const convertedMovie = convertTmdbToMovie(details);

                  // Mapper les genres TMDB avec les catégories
                  const genreMapping = {
                    28: 'Action', 12: 'Aventure', 16: 'Animation', 35: 'Comédie',
                    80: 'Crime', 99: 'Documentaire', 18: 'Drame', 10751: 'Familial',
                    14: 'Fantastique', 36: 'Histoire', 27: 'Horreur', 10402: 'Musique',
                    9648: 'Mystère', 10749: 'Romance', 878: 'Science-Fiction',
                    10770: 'Téléfilm', 53: 'Thriller', 10752: 'Guerre', 37: 'Western'
                  };

                  const tmdbGenreNames = convertedMovie.tmdbGenres.map(g =>
                    typeof g === 'object' ? g.name : genreMapping[g]
                  ).filter(Boolean);

                  const matchingCategoryIds = categories
                    .filter(cat => tmdbGenreNames.some(genreName =>
                      cat.name.toLowerCase().includes(genreName.toLowerCase()) ||
                      genreName.toLowerCase().includes(cat.name.toLowerCase())
                    ))
                    .map(cat => cat.id);

                  // Créer le film dans la BDD
                  const formData = new FormData();
                  formData.append('title', convertedMovie.title);
                  formData.append('description', convertedMovie.description);
                  formData.append('releaseDate', convertedMovie.releaseDate);
                  formData.append('duration', convertedMovie.duration);
                  formData.append('posterUrl', convertedMovie.poster);
                  formData.append('status', 'published');
                  if (matchingCategoryIds.length > 0) {
                    formData.append('categories', JSON.stringify(matchingCategoryIds));
                  }

                  const createdMovie = await admin.createMovie(formData);
                  const movieId = createdMovie.movie?.id || createdMovie.id;

                  // Naviguer vers le nouveau film créé
                  navigate(`/movie/${movieId}`);
                } catch (error) {
                  console.error('Erreur lors de la création du film:', error);
                  // Si le film existe déjà, rechercher dans le catalogue
                  navigate(`/catalog?search=${encodeURIComponent(movie.title)}`);
                }
              }}
              className="cursor-pointer"
            >
              <div className="relative aspect-[2/3] overflow-hidden bg-gray-700">
                {movie.poster_path ? (
                  <img
                    src={getTmdbImageUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className={`font-semibold text-sm mb-1 truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} title={movie.title}>
                  {movie.title}
                </h3>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </div>
                {movie.vote_average && (
                  <div className="flex items-center mt-1">
                    <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarMovies;
