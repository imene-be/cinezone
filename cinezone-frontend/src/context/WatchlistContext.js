import { createContext, useContext, useState, useEffect } from 'react';
import { watchlist as watchlistApi } from '../utils/api';
import { useAuth } from './AuthContext';

// Cr�ation du contexte
const WatchlistContext = createContext();

// Hook personnalis� pour utiliser le contexte facilement
export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist doit �tre utilis� dans un WatchlistProvider');
  }
  return context;
};

// Provider : composant qui enveloppe l'application et fournit les donn�es
export const WatchlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger la watchlist au montage du composant (si l'utilisateur est connect�)
  useEffect(() => {
    if (isAuthenticated) {
      loadWatchlist();
    } else {
      // Si l'utilisateur n'est pas connect�, vider la watchlist
      setWatchlist([]);
    }
  }, [isAuthenticated]);

  // Fonction pour charger la watchlist depuis l'API
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

  // Ajouter un film � la watchlist
  const addToWatchlist = async (movieId) => {
    try {
      const data = await watchlistApi.add(movieId);
      // Ajouter le film � l'�tat local
      setWatchlist([...watchlist, data.watchlist]);
      return { success: true };
    } catch (err) {
      console.error('Erreur ajout watchlist:', err);
      return { success: false, error: err.message };
    }
  };

  // Retirer un film de la watchlist
  const removeFromWatchlist = async (movieId) => {
    try {
      await watchlistApi.remove(movieId);
      // Retirer le film de l'�tat local
      setWatchlist(watchlist.filter(item =>
        (item.movieId.id || item.movieId) !== movieId
      ));
      return { success: true };
    } catch (err) {
      console.error('Erreur suppression watchlist:', err);
      return { success: false, error: err.message };
    }
  };

  // V�rifier si un film est dans la watchlist
  const isInWatchlist = (movieId) => {
    return watchlist.some(item =>
      (item.movieId.id || item.movieId) === movieId
    );
  };

  // Toggle : ajouter ou retirer selon l'�tat actuel
  const toggleWatchlist = async (movieId) => {
    if (isInWatchlist(movieId)) {
      return await removeFromWatchlist(movieId);
    } else {
      return await addToWatchlist(movieId);
    }
  };

  // Valeurs expos�es � tous les composants enfants
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
