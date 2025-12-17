import { useWatchlist } from '../context/WatchlistContext';
import { useTheme } from '../context/ThemeContext';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';

const Watchlist = () => {
  const { theme } = useTheme();
  const { watchlist, loading, error } = useWatchlist();

  if (loading) {
    return <Loading fullScreen text="Chargement..." />;
  }

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Ma Liste
          </h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Retrouvez tous vos films et séries sauvegardés
          </p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {watchlist.length > 0 ? (
          <>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {watchlist.length}
              </span> film{watchlist.length > 1 ? 's' : ''} dans votre liste
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {watchlist.map((item) => {
                const movie = item.movieId;
                return (
                  <MovieCard
                    key={movie.id || movie._id}
                    movie={movie}
                  />
                );
              })}
            </div>
          </>
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p className={`text-2xl mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Votre liste est vide
            </p>
            <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              Ajoutez des films pour les retrouver facilement
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
