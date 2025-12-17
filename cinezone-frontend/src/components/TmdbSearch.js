import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { searchMovies, getMovieDetails, convertTmdbToMovie, getTmdbImageUrl } from '../utils/tmdb';
import Button from './Button';

const TmdbSearch = ({ onSelectMovie, currentFormData }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 3) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchMovies(searchQuery);
      setSearchResults(results.slice(0, 5)); // Limiter à 5 résultats
    } catch (error) {
      console.error('Erreur de recherche TMDB:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMovie = async (movie) => {
    setLoadingDetails(true);
    try {
      // Récupérer les détails complets du film
      const details = await getMovieDetails(movie.id);
      const convertedMovie = convertTmdbToMovie(details);
      setSelectedMovie({ ...movie, ...details, converted: convertedMovie });
      setShowModal(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleConfirm = () => {
    if (selectedMovie) {
      // Ne remplir que les champs vides
      const newData = { ...selectedMovie.converted };

      // Vérifier chaque champ et ne remplir que s'il est vide
      Object.keys(newData).forEach(key => {
        if (currentFormData[key] && currentFormData[key] !== '') {
          delete newData[key];
        }
      });

      onSelectMovie(newData);
      setShowModal(false);
      setSearchQuery('');
      setSearchResults([]);
      setSelectedMovie(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  return (
    <div className="mb-6">
      {/* Barre de recherche */}
      <div className="relative">
        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          🎬 Rechercher sur TMDB (optionnel)
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un film sur TMDB..."
            className={`w-full px-4 py-3 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Résultats de recherche */}
        {searchResults.length > 0 && (
          <div className={`absolute z-10 w-full mt-2 rounded-lg shadow-lg overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            {searchResults.map((movie) => (
              <button
                key={movie.id}
                onClick={() => handleSelectMovie(movie)}
                disabled={loadingDetails}
                className={`w-full p-3 flex items-center space-x-3 text-left transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                {movie.poster_path ? (
                  <img
                    src={getTmdbImageUrl(movie.poster_path, 'w92')}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-16 bg-gray-600 rounded flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {movie.title}
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmation */}
      {showModal && selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`max-w-2xl w-full rounded-lg shadow-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Header */}
            <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Importer depuis TMDB
              </h3>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="flex space-x-4">
                {selectedMovie.poster_path && (
                  <img
                    src={getTmdbImageUrl(selectedMovie.poster_path)}
                    alt={selectedMovie.title}
                    className="w-32 h-48 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {selectedMovie.title}
                  </h4>
                  <div className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <strong>Date de sortie:</strong> {selectedMovie.release_date || 'N/A'}
                  </div>
                  <div className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <strong>Durée:</strong> {selectedMovie.runtime ? `${selectedMovie.runtime} min` : 'N/A'}
                  </div>
                  {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                    <div className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <strong>Genres:</strong> {selectedMovie.genres.map(g => g.name).join(', ')}
                    </div>
                  )}
                  <div className={`text-sm mt-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedMovie.overview}
                  </div>
                </div>
              </div>

              <div className={`mt-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-cyan-900 bg-opacity-20 border border-cyan-700' : 'bg-cyan-50 border border-cyan-200'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-800'}`}>
                  ℹ️ Seuls les champs vides seront remplis avec les informations de TMDB.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className={`p-6 border-t flex justify-end space-x-3 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <Button
                variant="secondary"
                onClick={handleCancel}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
              >
                Importer les données
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TmdbSearch;
