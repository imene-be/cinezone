import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { admin, categories as categoriesApi } from '../../utils/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import AdminHeader from '../../components/AdminHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import TmdbSearch from '../../components/TmdbSearch';

const MoviesNew = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    duration: '',
    trailer: '',
    status: 'published',
    categoryIds: []
  });
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data.categories || data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTmdbSelect = async (tmdbData) => {
    // Remplir uniquement les champs vides
    setFormData(prev => {
      const newData = { ...prev };

      if (!newData.title && tmdbData.title) newData.title = tmdbData.title;
      if (!newData.description && tmdbData.description) newData.description = tmdbData.description;
      if (!newData.releaseDate && tmdbData.releaseDate) newData.releaseDate = tmdbData.releaseDate;
      if (!newData.duration && tmdbData.duration) newData.duration = tmdbData.duration;
      if (!newData.trailer && tmdbData.trailer) newData.trailer = tmdbData.trailer;

      // Ajouter l'URL du poster TMDB directement
      if (!posterFile && tmdbData.poster) {
        newData.posterUrl = tmdbData.poster;
      }

      return newData;
    });

    // Afficher le preview du poster TMDB
    if (tmdbData.poster && !posterFile) {
      setPosterPreview(tmdbData.poster);
    }

    // Mapper les genres TMDB avec les catégories
    if (tmdbData.tmdbGenres && tmdbData.tmdbGenres.length > 0) {
      const genreMapping = {
        28: 'Action', 12: 'Aventure', 16: 'Animation', 35: 'Comédie',
        80: 'Crime', 99: 'Documentaire', 18: 'Drame', 10751: 'Familial',
        14: 'Fantastique', 36: 'Histoire', 27: 'Horreur', 10402: 'Musique',
        9648: 'Mystère', 10749: 'Romance', 878: 'Science-Fiction',
        10770: 'Téléfilm', 53: 'Thriller', 10752: 'Guerre', 37: 'Western'
      };

      const tmdbGenreNames = tmdbData.tmdbGenres.map(g =>
        typeof g === 'object' ? g.name : genreMapping[g]
      ).filter(Boolean);

      // Trouver les catégories correspondantes
      const matchingCategoryIds = categories
        .filter(cat => tmdbGenreNames.some(genreName =>
          cat.name.toLowerCase().includes(genreName.toLowerCase()) ||
          genreName.toLowerCase().includes(cat.name.toLowerCase())
        ))
        .map(cat => cat.id);

      if (matchingCategoryIds.length > 0) {
        setFormData(prev => ({
          ...prev,
          categoryIds: [...new Set([...prev.categoryIds, ...matchingCategoryIds])]
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      return setError('Le titre est requis');
    }

    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    const fd = new FormData();
    fd.append('title', formData.title);
    if (formData.description) fd.append('description', formData.description);
    if (formData.releaseDate) fd.append('releaseDate', formData.releaseDate);
    if (formData.duration) fd.append('duration', formData.duration);
    if (formData.trailer) fd.append('trailer', formData.trailer);
    fd.append('status', formData.status);
    if (formData.categoryIds.length > 0) {
      fd.append('categories', JSON.stringify(formData.categoryIds));
    }
    // Si un fichier est uploadé, l'utiliser. Sinon, utiliser l'URL TMDB si disponible
    if (posterFile) {
      fd.append('poster', posterFile);
    } else if (formData.posterUrl) {
      fd.append('posterUrl', formData.posterUrl);
    }

    setLoading(true);
    try {
      await admin.createMovie(fd);
      navigate('/admin/movies');
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors de la création du film');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminHeader
          title="Ajouter un film"
          subtitle="Remplissez les informations du nouveau film"
        />

        {/* Form */}
        <div className={`rounded-lg p-6 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* TMDB Search */}
            <TmdbSearch onSelectMovie={handleTmdbSelect} currentFormData={formData} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Title */}
                <Input
                  label="Titre"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Le titre du film"
                  required
                />

                {/* Release Date */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date de sortie
                  </label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                {/* Duration */}
                <Input
                  label="Durée (en minutes)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="120"
                  min="1"
                />

                {/* Trailer URL */}
                <Input
                  label="URL de la bande-annonce"
                  name="trailer"
                  value={formData.trailer}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                />

                {/* Status */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Statut
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Poster Upload */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Affiche (poster)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  {posterPreview && (
                    <div className="mt-4">
                      <img src={posterPreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                    </div>
                  )}
                </div>

                {/* Categories */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Catégories
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                    {categories.map(category => (
                      <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.categoryIds.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                          className="w-4 h-4 text-cyan-500 rounded focus:ring-cyan-500"
                        />
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Description - Full Width */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Synopsis du film..."
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/admin/movies')}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Annuler
              </button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Création...' : 'Créer le film'}
              </Button>
            </div>
          </form>
        </div>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmSubmit}
          title="Confirmer la création"
          message="Êtes-vous sûr de vouloir créer ce film avec les informations fournies ?"
          confirmText="Créer"
          confirmColor="blue"
        />
      </div>
    </div>
  );
};

export default MoviesNew;
