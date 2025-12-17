import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { categories as categoriesApi, admin } from '../../utils/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import AdminHeader from '../../components/AdminHeader';
import ConfirmDialog from '../../components/ConfirmDialog';


const CategoriesEdit = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCategory = async () => {
    try {
      const data = await categoriesApi.getAll();
      const categories = data.categories || data || [];
      const category = categories.find(c => c.id === parseInt(id));

      if (!category) {
        setError('Catégorie introuvable');
        return;
      }

      setFormData({
        name: category.name || '',
        description: category.description || '',
      });
    } catch (err) {
      setError('Erreur lors du chargement de la catégorie');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      return setError('Le nom de la catégorie est requis');
    }

    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setSaving(true);
    try {
      await admin.updateCategory(id, formData);
      navigate('/admin/categories');
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors de la mise à jour de la catégorie');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Chargement de la catégorie..." />;
  }

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminHeader
          title="Modifier la catégorie"
          subtitle="Modifiez les informations de cette catégorie"
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

            {/* Name */}
            <Input
              label="Nom de la catégorie"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Action, Comédie, Drame..."
              required
            />

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Description (optionnelle)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Décrivez cette catégorie..."
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/categories')}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Annuler
              </button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </div>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmSubmit}
          title="Confirmer les modifications"
          message="Êtes-vous sûr de vouloir enregistrer ces modifications ?"
          confirmText="Enregistrer"
          confirmColor="blue"
        />
      </div>
    </div>
  );
};

export default CategoriesEdit;
