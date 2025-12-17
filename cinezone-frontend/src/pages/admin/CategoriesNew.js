import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { admin } from '../../utils/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import AdminHeader from '../../components/AdminHeader';
import ConfirmDialog from '../../components/ConfirmDialog';

const CategoriesNew = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

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
    setLoading(true);
    try {
      await admin.createCategory(formData);
      navigate('/admin/categories');
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors de la création de la catégorie');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminHeader
          title="Ajouter une catégorie"
          subtitle="Créez une nouvelle catégorie pour organiser vos films"
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
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Création...' : 'Créer la catégorie'}
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
          message="Êtes-vous sûr de vouloir créer cette catégorie ?"
          confirmText="Créer"
          confirmColor="blue"
        />
      </div>
    </div>
  );
};

export default CategoriesNew;
