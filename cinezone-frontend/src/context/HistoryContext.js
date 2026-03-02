import { createContext, useContext, useState, useEffect } from 'react';
import { history as historyApi } from '../utils/api';
import { useAuth } from './AuthContext';

const HistoryContext = createContext();

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory doit être utilisé dans un HistoryProvider');
  }
  return context;
};

export const HistoryProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    } else {

      setHistory([]);
    }
  }, [isAuthenticated]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await historyApi.get({ limit: 500 });
      setHistory(data.history || []);
    } catch (err) {
      setError('Erreur lors du chargement de l\'historique');
      console.error('Erreur historique:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshHistory = async () => {
    await loadHistory();
  };

  const isInHistory = (movieId) => {
    return history.some(item => {
      const movie = item.movie || item.movieId;
      return movie && (movie.id || movie._id) === movieId;
    });
  };

  const getWatchedDate = (movieId) => {
    const item = history.find(item => {
      const movie = item.movie || item.movieId;
      return movie && (movie.id || movie._id) === movieId;
    });
    return item ? (item.createdAt || item.watchedAt) : null;
  };

  const getHistoryCount = () => {
    return history.length;
  };

  const getRecentHistory = (limit = 5) => {
    return history.slice(0, limit);
  };

  const value = {
    history,
    loading,
    error,
    loadHistory,
    refreshHistory,
    isInHistory,
    getWatchedDate,
    getHistoryCount,
    getRecentHistory,
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};
