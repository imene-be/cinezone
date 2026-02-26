import { createContext, useContext, useState, useEffect } from 'react';
import { history as historyApi } from '../utils/api';
import { useAuth } from './AuthContext';

// Création du contexte
const HistoryContext = createContext();

// Hook personnalisé pour utiliser le contexte facilement
export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory doit être utilisé dans un HistoryProvider');
  }
  return context;
};

// Provider : composant qui enveloppe l'application et fournit les données
export const HistoryProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger l'historique au montage du composant (si l'utilisateur est connecté)
  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    } else {
      // Si l'utilisateur n'est pas connecté, vider l'historique
      setHistory([]);
    }
  }, [isAuthenticated]);

  // Fonction pour charger l'historique depuis l'API
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

  // Rafraîchir l'historique (utile après avoir ajouté un film)
  const refreshHistory = async () => {
    await loadHistory();
  };

  // Vérifier si un film est dans l'historique
  const isInHistory = (movieId) => {
    return history.some(item => {
      const movie = item.movie || item.movieId;
      return movie && (movie.id || movie._id) === movieId;
    });
  };

  // Obtenir la date de visionnage d'un film
  const getWatchedDate = (movieId) => {
    const item = history.find(item => {
      const movie = item.movie || item.movieId;
      return movie && (movie.id || movie._id) === movieId;
    });
    return item ? (item.createdAt || item.watchedAt) : null;
  };

  // Obtenir le nombre total de films visionnés
  const getHistoryCount = () => {
    return history.length;
  };

  // Obtenir les films récemment visionnés (limite optionnelle)
  const getRecentHistory = (limit = 5) => {
    return history.slice(0, limit);
  };

  // Valeurs exposées à tous les composants enfants
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
