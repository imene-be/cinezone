import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Card from './Card';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const inWatchlist = isInWatchlist(movie.id);

  // Charger l'image via Axios
  useEffect(() => {
    const loadImage = async () => {
      if (!movie.poster) {
        setImageSrc(null);
        return;
      }

      // Si c'est une URL externe (TMDB), utiliser directement
      if (movie.poster.startsWith('http')) {
        setImageSrc(movie.poster);
        return;
      }

      // Sinon, charger depuis le backend via Axios
      try {
        let baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';
        if (baseUrl.endsWith('/api')) baseUrl = baseUrl.replace(/\/api\/?$/, '');
        const response = await axios.get(`${baseUrl}${movie.poster}`, {
          responseType: 'blob'
        });
        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error('Erreur chargement image:', error);
        setImageError(true);
      }
    };

    loadImage();

    // Cleanup: libérer l'URL blob quand le composant se démonte
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [movie.poster]);

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleWatchlistToggle = async (e) => {
    e.stopPropagation(); // Empêcher la navigation

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    await toggleWatchlist(movie.id);
  };

  return (
    <article
      data-testid="movie-card"
      className="relative group"
      role="article"
      aria-label={`Film: ${movie.title}`}
    >
      <Card hover onClick={handleClick}>
        {/* Image du film */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-700">
          {!imageError && imageSrc ? (
            <img
              src={imageSrc}
              alt={`Affiche du film ${movie.title}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              role="img"
              aria-label="Image non disponible"
            >
              <svg
                className="w-16 h-16 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
              </svg>
            </div>
          )}

          {/* Overlay avec boutons */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
            aria-hidden="true"
          >
            <button
              onClick={handleWatchlistToggle}
              className="bg-cyan-400 hover:bg-cyan-500 text-gray-900 p-3 rounded-full mr-2 transition-transform hover:scale-110"
              title={inWatchlist ? 'Retirer de ma liste' : 'Ajouter à ma liste'}
              aria-label={inWatchlist ? `Retirer ${movie.title} de ma liste` : `Ajouter ${movie.title} à ma liste`}
            >
            {inWatchlist ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <button
            onClick={handleClick}
            className="bg-white hover:bg-gray-200 text-gray-900 p-3 rounded-full transition-transform hover:scale-110"
            title="Voir les détails"
            aria-label={`Voir les détails de ${movie.title}`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Informations du film */}
      <div className="p-3 transition-transform duration-300 group-hover:-translate-y-0.5">
        <h3 className="font-semibold text-sm leading-snug mb-1 truncate text-white" title={movie.title}>
          {movie.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <time dateTime={movie.releaseYear}>{movie.releaseYear || 'N/A'}</time>
          {movie.rating && (
            <div className="flex items-center" aria-label={`Note: ${movie.rating.toFixed(1)} sur 10`}>
              <svg className="w-3 h-3 text-yellow-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Catégories */}
        {movie.categoryIds && movie.categoryIds.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5" role="list" aria-label="Catégories">
            {movie.categoryIds.slice(0, 2).map((category, index) => (
              <span
                key={index}
                role="listitem"
                className="text-xs bg-gray-700/80 text-cyan-400 px-1.5 py-0.5 rounded-md"
              >
                {category.name || category}
              </span>
            ))}
          </div>
        )}
      </div>
      </Card>
    </article>
  );
};

export default MovieCard;
