import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { admin } from '../../utils/api';
import Loading from '../../components/Loading';
import AdminHeader from '../../components/AdminHeader';
import ConfirmDialog from '../../components/ConfirmDialog';

const AdminUsers = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await admin.getAllUsers({ limit: 500 });
      setUsers(data.users || []);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await admin.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur');
      console.error(err);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const matchesSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <Loading fullScreen text="Chargement des utilisateurs..." />;
  }

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminHeader
          title="Gestion des Utilisateurs"
          subtitle={`${filteredUsers.length} utilisateur${filteredUsers.length > 1 ? 's' : ''} au total`}
        />

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">Tous les rôles</option>
            <option value="user">Utilisateurs</option>
            <option value="admin">Administrateurs</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className={`rounded-lg shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Utilisateur
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Rôle
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date d'inscription
                  </th>
                  <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={theme === 'dark' ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mr-3 ${
                          user.role === 'admin' ? 'bg-purple-500' : 'bg-green-500'
                        }`}>
                          {user.firstName?.charAt(0).toUpperCase() || user.lastName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Sans nom'}
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDeleteConfirm(user.id)}
                        disabled={user.role === 'admin'}
                        className={`inline-flex items-center px-3 py-1 rounded transition-colors ${
                          user.role === 'admin'
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                        title={user.role === 'admin' ? 'Impossible de supprimer un administrateur' : 'Supprimer cet utilisateur'}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && !loading && (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <p className="text-xl">Aucun utilisateur trouvé</p>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirm !== null}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible et supprimera également toutes ses données (notes, watchlist, historique)."
          confirmText="Supprimer"
          confirmColor="red"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className={`rounded-lg p-6 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total
                </p>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {users.length}
                </p>
              </div>
              <div className="text-green-400">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-6 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Utilisateurs
                </p>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {users.filter(u => u.role === 'user').length}
                </p>
              </div>
              <div className="text-blue-400">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-6 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Administrateurs
                </p>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="text-purple-400">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
