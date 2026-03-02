import { createContext, useContext, useState, useEffect } from 'react';
import { notes as notesApi } from '../utils/api';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes doit être utilisé dans un NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotes();
    } else {

      setNotes([]);
    }
  }, [isAuthenticated]);

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

  const refreshNotes = async () => {
    await loadNotes();
  };

  const createOrUpdateNote = async (movieId, rating, comment) => {
    try {
      const data = await notesApi.createOrUpdate(movieId, rating, comment);
      await loadNotes();
      return { success: true, data };
    } catch (err) {
      console.error('Erreur création/mise à jour note:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await notesApi.delete(noteId);

      setNotes(notes.filter(note => note.id !== noteId));
      return { success: true };
    } catch (err) {
      console.error('Erreur suppression note:', err);
      return { success: false, error: err.message };
    }
  };

  const getNoteForMovie = (movieId) => {
    return notes.find(note => {
      const movie = note.movie || note.movieId;
      return movie && (movie.id || movie._id) === movieId;
    });
  };

  const hasNotedMovie = (movieId) => {
    return notes.some(note => {
      const movie = note.movie || note.movieId;
      return movie && (movie.id || movie._id) === movieId;
    });
  };

  const getNotesCount = () => {
    return notes.length;
  };

  const getAverageRating = () => {
    if (notes.length === 0) return 0;
    const sum = notes.reduce((acc, note) => acc + parseFloat(note.rating), 0);
    return (sum / notes.length).toFixed(1);
  };

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
