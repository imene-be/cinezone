import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { categories as categoriesApi, admin } from '../../utils/api';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import AdminHeader from '../../components/AdminHeader';
import ConfirmDialog from '../../components/ConfirmDialog';

const AdminCategories = () => {
  const { theme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll({ limit: 500 });
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erreur lors du chargement des catégories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await admin.deleteCategory(categoryId);
      setCategories(categories.filter(c => c.id !== categoryId));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Erreur lors de la suppression de la catégorie');
      console.error(err);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <Loading fullScreen text="Chargement des catégories..." />;
  }

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminHeader
          title="Gestion des Catégories"
          subtitle={`${filteredCategories.length} catégorie${filteredCategories.length > 1 ? 's' : ''} au total`}
        />

        {/* Action Button */}
        <div className="flex justify-end mb-6">
          <Link to="/admin/categories/new">
            <Button variant="primary" size="lg">
              <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Ajouter une catégorie
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className={`rounded-lg p-6 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
                <Link
                  to={`/admin/categories/edit/${category.id}`}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
                >
                  Modifier
                </Link>
                <button
                  onClick={() => setDeleteConfirm(category.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && !loading && (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <p className="text-xl">Aucune catégorie trouvée</p>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirm !== null}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible."
          confirmText="Supprimer"
          confirmColor="red"
        />
      </div>
    </div>
  );
};

export default AdminCategories;
