import { useHistory } from '../context/HistoryContext';
import { useTheme } from '../context/ThemeContext';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';

const History = () => {
  const { theme } = useTheme();
  const { history, loading, error } = useHistory();

  if (loading) {
    return <Loading fullScreen text="Chargement..." />;
  }

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Historique
          </h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Films et séries que vous avez regardés récemment
          </p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-8">
            {typeof error === 'string' ? error : (error.message || 'Erreur')}
          </div>
        )}

        {history.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4">
            {history.map((item, index) => {
              // Le backend retourne soit 'movie' soit 'movieId'
              const movie = item.movie || item.movieId;

              // Si le film n'existe pas, on saute cet élément
              if (!movie) return null;

              return (
                <div key={item.id || item._id || `history-${index}`} className="relative">
                  <MovieCard movie={movie} />
                  <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Regardé le {new Date(item.createdAt || item.watchedAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg
              className={`w-24 h-24 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className={`text-2xl mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Aucun historique
            </p>
            <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              Les films que vous regardez apparaîtront ici
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
