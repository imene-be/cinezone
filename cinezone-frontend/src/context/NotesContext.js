import { createContext, useContext, useState, useEffect } from 'react';
import { notes as notesApi } from '../utils/api';
import { useAuth } from './AuthContext';

// Création du contexte
const NotesContext = createContext();

// Hook personnalisé pour utiliser le contexte facilement
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes doit être utilisé dans un NotesProvider');
  }
  return context;
};

// Provider : composant qui enveloppe l'application et fournit les données
export const NotesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les notes au montage du composant (si l'utilisateur est connecté)
  useEffect(() => {
    if (isAuthenticated) {
      loadNotes();
    } else {
      // Si l'utilisateur n'est pas connecté, vider les notes
      setNotes([]);
    }
  }, [isAuthenticated]);

  // Fonction pour charger les notes depuis l'API
  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notesApi.get();
      setNotes(data || []);
    } catch (err) {
      setError('Erreur lors du chargement des notes');
      console.error('Erreur notes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Rafraîchir les notes
  const refreshNotes = async () => {
    await loadNotes();
  };

  // Créer ou mettre à jour une note
  const createOrUpdateNote = async (movieId, rating, comment) => {
    try {
      const data = await notesApi.createOrUpdate(movieId, rating, comment);
      await loadNotes(); // Recharger toutes les notes
      return { success: true, data };
    } catch (err) {
      console.error('Erreur création/mise à jour note:', err);
      return { success: false, error: err.message };
    }
  };

  // Supprimer une note
  const deleteNote = async (noteId) => {
    try {
      await notesApi.delete(noteId);
      // Retirer la note de l'état local
      setNotes(notes.filter(note => note.id !== noteId));
      return { success: true };
    } catch (err) {
      console.error('Erreur suppression note:', err);
      return { success: false, error: err.message };
    }
  };

  // Obtenir la note pour un film spécifique
  const getNoteForMovie = (movieId) => {
    return notes.find(note => {
      const movie = note.movie || note.movieId;
      return movie && (movie.id || movie._id) === movieId;
    });
  };

  // Vérifier si l'utilisateur a noté un film
  const hasNotedMovie = (movieId) => {
    return notes.some(note => {
      const movie = note.movie || note.movieId;
      return movie && (movie.id || movie._id) === movieId;
    });
  };

  // Obtenir le nombre total de notes
  const getNotesCount = () => {
    return notes.length;
  };

  // Obtenir la note moyenne de l'utilisateur
  const getAverageRating = () => {
    if (notes.length === 0) return 0;
    const sum = notes.reduce((acc, note) => acc + parseFloat(note.rating), 0);
    return (sum / notes.length).toFixed(1);
  };

  // Valeurs exposées à tous les composants enfants
  const value = {
    notes,
    loading,
    error,
    loadNotes,
    refreshNotes,
    createOrUpdateNote,
    deleteNote,
    getNoteForMovie,
    hasNotedMovie,
    getNotesCount,
    getAverageRating,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
