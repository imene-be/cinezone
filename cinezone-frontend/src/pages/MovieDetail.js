import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { movies } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useNotes } from '../context/NotesContext';
import Button from '../components/Button';
import Loading from '../components/Loading';
import SimilarMovies from '../components/SimilarMovies';
import { formatDuration } from '../utils/format';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { getNoteForMovie, createOrUpdateNote, deleteNote } = useNotes();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [posterSrc, setPosterSrc] = useState(null);

  // Utiliser le contexte pour obtenir la note - PERMANENTE!
  const userNote = getNoteForMovie(parseInt(id, 10));

  // États du formulaire uniquement
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);

  const formalizeDate = (date) => {
    const dateF = new Date(date);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
    return dateF.toLocaleDateString("fr-FR",options)
  }

  useEffect(() => {
    loadMovieDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Charger le poster via Axios
  useEffect(() => {
    const loadPoster = async () => {
      if (!movie?.poster) {
        setPosterSrc(null);
        return;
      }

      // URL externe (TMDB)
      if (movie.poster.startsWith('http')) {
        setPosterSrc(movie.poster);
        return;
      }

      // Image locale via Axios
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';
        const response = await axios.get(`${baseUrl}${movie.poster}`, {
          responseType: 'blob'
        });
        const imageUrl = URL.createObjectURL(response.data);
        setPosterSrc(imageUrl);
      } catch (error) {
        console.error('Erreur chargement poster:', error);
      }
    };

    loadPoster();

    return () => {
      if (posterSrc && posterSrc.startsWith('blob:')) {
        URL.revokeObjectURL(posterSrc);
      }
    };
  }, [movie]);

  // Synchroniser le formulaire avec la note du contexte
  useEffect(() => {
    if (userNote) {
      setRating(Number(userNote.rating));
      setComment(userNote.comment || '');
    } else {
      setRating(0);
      setComment('');
    }
  }, [userNote]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      const data = await movies.getById(id);
      setMovie(data.movie || data);
    } catch (err) {
      setError('Film introuvable');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    await toggleWatchlist(parseInt(id, 10));
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (rating === 0) {
      alert('Veuillez sélectionner une note');
      return;
    }

    try {
      // Utiliser le contexte - la note sera PERMANENTE!
      const result = await createOrUpdateNote(parseInt(id, 10), rating, comment);

      if (result.success) {
        console.log('Note enregistrée avec succès dans la base de données');

        // Fermer le formulaire
        setShowRatingForm(false);

        // Recharger les détails du film pour mettre à jour la note moyenne
        const data = await movies.getById(id);
        setMovie(data.movie || data);

        // Pas besoin de setUserNote - le contexte se met à jour automatiquement!
      } else {
        console.error('Erreur:', result.error);
        alert('Erreur lors de l\'enregistrement de votre note. Veuillez réessayer.');
      }
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      alert('Erreur lors de l\'enregistrement de votre note. Veuillez réessayer.');
    }
  };

  const handleDeleteNote = async () => {
    if (!window.confirm('Voulez-vous vraiment supprimer votre note ?')) {
      return;
    }

    try {
      const result = await deleteNote(userNote.id);

      if (result.success) {
        console.log('Note supprimée avec succès');

        // Recharger les détails du film pour mettre à jour la note moyenne
        const data = await movies.getById(id);
        setMovie(data.movie || data);

        // Réinitialiser le formulaire
        setRating(0);
        setComment('');
      } else {
        alert('Erreur lors de la suppression de votre note.');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert('Erreur lors de la suppression de votre note.');
    }
  };

  const handlePlay = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsPlaying(true);
  };

  if (loading) {
    return <Loading fullScreen text="Chargement du film..." />;
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-red-500 mb-4">{error}</p>
          <Button onClick={() => navigate('/catalog')}>
            Retour au catalogue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section avec image de fond */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Image de fond avec overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: posterSrc
              ? `url(${posterSrc})`
              : 'linear-gradient(to bottom, #1f2937, #111827)',
          }}
        >

          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        </div>

        {/* Contenu Hero */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
              <span>{formalizeDate(movie.releaseDate)}</span>
              <span>•</span>
              <span>{formatDuration(movie.duration)}</span>
              {movie.rating && (
                <>
                  <span>•</span>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-yellow-400 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{movie.rating.toFixed(1)}/10</span>
                  </div>
                </>
              )}
            </div>

            {/* Catégories */}
            {movie.categoryIds && movie.categoryIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.categoryIds.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-cyan-400 bg-opacity-20 text-cyan-400 rounded-full text-sm font-medium"
                  >
                    {category.name || category}
                  </span>
                ))}
              </div>
            )}

            <p className="text-lg text-gray-300 mb-8 line-clamp-3">
              {movie.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                variant={isInWatchlist(parseInt(id, 10)) ? 'secondary' : 'primary'}
                size="lg"
                onClick={handleWatchlistToggle}
                className="flex items-center"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                {isInWatchlist(parseInt(id, 10)) ? 'Retirer de ma liste' : 'Ajouter à ma liste'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lecteur vidéo */}
      {isPlaying && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-black rounded-lg overflow-hidden aspect-video">
            {movie.videoUrl ? (
              <video
                className="w-full h-full"
                controls
                autoPlay
                src={movie.videoUrl}
              >
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <svg
                    className="w-24 h-24 mx-auto mb-4 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-xl">Vidéo non disponible</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Détails du film */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Section Notes et Commentaires */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Notes et Commentaires
              </h2>

              {isAuthenticated ? (
                <>
                  {userNote ? (
                    <div className="bg-gray-800 rounded-lg p-6 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-400">Votre note (permanente ✅)</p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-6 h-6 ${
                                  i < Math.floor(Number(userNote.rating))
                                    ? 'text-yellow-400'
                                    : 'text-gray-600'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-white font-semibold">
                              {Number(userNote.rating)}/5
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setRating(Number(userNote.rating));
                              setComment(userNote.comment || '');
                              setShowRatingForm(true);
                            }}
                          >
                            Modifier
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDeleteNote}
                            className="text-red-400 hover:text-red-300"
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                      {userNote.comment && (
                        <p className="text-gray-300">{userNote.comment}</p>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowRatingForm(true)}
                      className="mb-4"
                    >
                      Ajouter une note
                    </Button>
                  )}

                  {/* Formulaire de notation */}
                  {showRatingForm && (
                    <div className="bg-gray-800 rounded-lg p-6 mb-4">
                      <form onSubmit={handleSubmitRating}>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Votre note (sur 5)
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                              >
                                <svg
                                  className={`w-8 h-8 ${
                                    star <= rating
                                      ? 'text-yellow-400'
                                      : 'text-gray-600'
                                  } hover:text-yellow-400 transition-colors`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Votre commentaire (optionnel)
                          </label>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                            placeholder="Partagez votre avis..."
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={rating === 0}
                          >
                            {userNote ? 'Mettre à jour' : 'Enregistrer'}
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowRatingForm(false)}
                          >
                            Annuler
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <p className="text-gray-400 mb-4">
                    Connectez-vous pour noter ce film
                  </p>
                  <Button onClick={() => navigate('/login')}>
                    Se connecter
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Informations
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400">Année de sortie</p>
                  <p className="text-white">{formalizeDate(movie.releaseDate)}</p>
                </div>
                {movie.duration && (
                  <div>
                    <p className="text-gray-400">Durée</p>
                    <p className="text-white">{formatDuration(movie.duration)}</p>
                  </div>
                )}
                {movie.director && (
                  <div>
                    <p className="text-gray-400">Réalisateur</p>
                    <p className="text-white">{movie.director}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Catégories */}
            {movie.categoryIds && movie.categoryIds.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.categoryIds.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-cyan-400 bg-opacity-20 text-cyan-400 rounded-full text-sm"
                    >
                      {category.name || category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Films similaires */}
      <SimilarMovies movieTitle={movie.title} movieCategories={movie.categoryIds} />
    </div>
  );
};

export default MovieDetail;
