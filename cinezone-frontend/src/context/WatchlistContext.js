import { createContext, useContext, useState, useEffect } from 'react';
import { watchlist as watchlistApi } from '../utils/api';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist doit �tre utilis� dans un WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadWatchlist();
    } else {

      setWatchlist([]);
    }
  }, [isAuthenticated]);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await watchlistApi.get();
      setWatchlist(data.watchlist || []);
    } catch (err) {
      setError('Erreur lors du chargement de la watchlist');
      console.error('Erreur watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (movieId) => {
    try {
      const data = await watchlistApi.add(movieId);

      setWatchlist([...watchlist, data.watchlist]);
      return { success: true };
    } catch (err) {
      console.error('Erreur ajout watchlist:', err);
      return { success: false, error: err.message };
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      await watchlistApi.remove(movieId);

      setWatchlist(watchlist.filter(item =>
        (item.movieId.id || item.movieId) !== movieId
      ));
      return { success: true };
    } catch (err) {
      console.error('Erreur suppression watchlist:', err);
      return { success: false, error: err.message };
    }
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some(item =>
      (item.movieId.id || item.movieId) === movieId
    );
  };

  const toggleWatchlist = async (movieId) => {
    if (isInWatchlist(movieId)) {
      return await removeFromWatchlist(movieId);
    } else {
      return await addToWatchlist(movieId);
    }
  };

  const value = {
    watchlist,
    loading,
    error,
    loadWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};
