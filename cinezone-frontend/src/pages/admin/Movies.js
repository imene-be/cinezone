import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { movies as moviesApi, admin } from '../../utils/api';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import AdminHeader from '../../components/AdminHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import axios from 'axios';

// Component pour charger le poster via Axios blob
const MoviePoster = ({ poster, title }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      if (!poster) {
        setImageSrc(null);
        return;
      }

      // Si c'est une URL externe (TMDB), utiliser directement
      if (poster.startsWith('http')) {
        setImageSrc(poster);
        return;
      }

      // Sinon, charger depuis le backend via Axios
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';
        const response = await axios.get(`${baseUrl}${poster}`, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poster]);

  if (!poster || imageError || !imageSrc) {
    return (
      <div className="w-12 h-16 bg-gray-700 rounded mr-4 flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={title}
      className="w-12 h-16 object-cover rounded mr-4"
      onError={() => setImageError(true)}
    />
  );
};

const AdminMovies = () => {
  const { theme } = useTheme();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await moviesApi.getAll({ includeAllStatus: true, limit: 1000 });
      setMovies(data.movies || data || []);
    } catch (err) {
      setError('Erreur lors du chargement des films');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movieId) => {
    try {
      await admin.deleteMovie(movieId);
      setMovies(movies.filter(m => m.id !== movieId));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Erreur lors de la suppression du film');
      console.error(err);
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <Loading fullScreen text="Chargement des films..." />;
  }

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminHeader
          title="Gestion des Films"
          subtitle={`${filteredMovies.length} film${filteredMovies.length > 1 ? 's' : ''} au total`}
        />

        {/* Action Button */}
        <div className="flex justify-end mb-6">
          <Link to="/admin/movies/new">
            <Button variant="primary" size="lg">
              <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Ajouter un film
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher un film..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {filteredMovies.length === 0 && !loading && (
          <div className={`text-center py-12 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
            <p className={`text-xl mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
              Aucun film trouvé
            </p>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchQuery ? 'Essayez de modifier votre recherche' : 'Commencez par ajouter votre premier film'}
            </p>
          </div>
        )}

        {/* Movies Table */}
        {filteredMovies.length > 0 && (
          <div className={`rounded-lg shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Film
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Catégories
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date / Durée
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Note
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Statut
                  </th>
                  <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredMovies.map((movie) => (
                  <tr key={movie.id} className={theme === 'dark' ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <MoviePoster poster={movie.poster} title={movie.title} />
                        <div className="max-w-xs">
                          <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {movie.title}
                          </div>
                          {movie.description && (
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                              {movie.description.substring(0, 50)}{movie.description.length > 50 ? '...' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {movie.categories && movie.categories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {movie.categories.map(cat => (
                            <span key={cat.id} className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Aucune</span>
                      )}
                    </td>
                    <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      <div>
                        {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('fr-FR') : 'N/A'}
                      </div>
                      {movie.duration && (
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {movie.duration} min
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}>
                          {movie.averageRating ? parseFloat(movie.averageRating).toFixed(1) : '0.0'}
                        </span>
                        <span className={`text-xs ml-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          ({movie.ratingsCount || 0})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        movie.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : movie.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {movie.status === 'published' ? 'Publié' : movie.status === 'draft' ? 'Brouillon' : 'Archivé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/admin/movies/edit/${movie.id}`}
                        className="inline-flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(movie.id)}
                        className="inline-flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirm !== null}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer ce film ? Cette action est irréversible."
          confirmText="Supprimer"
          confirmColor="red"
        />
      </div>
    </div>
  );
};

export default AdminMovies;
