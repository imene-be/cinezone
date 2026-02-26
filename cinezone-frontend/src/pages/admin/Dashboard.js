import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { admin, movies as moviesApi, categories as categoriesApi } from '../../utils/api';
import Loading from '../../components/Loading';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalCategories: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Utiliser Promise.allSettled pour que les erreurs individuelles n'arrêtent pas tout
      const [moviesResult, categoriesResult, usersResult] = await Promise.allSettled([
        moviesApi.getAllWithPagination({ limit: 500 }),
        categoriesApi.getAllWithPagination({ limit: 500 }),
        admin.getAllUsers({ limit: 500 }),
      ]);

      const moviesData = moviesResult.status === 'fulfilled' ? moviesResult.value : { pagination: { total: 0 } };
      const categoriesData = categoriesResult.status === 'fulfilled' ? categoriesResult.value : { pagination: { total: 0 } };
      const usersData = usersResult.status === 'fulfilled' ? usersResult.value : { pagination: { total: 0 } };

      setStats({
        totalMovies: moviesData.pagination?.total || 0,
        totalCategories: categoriesData.pagination?.total || 0,
        totalUsers: usersData.pagination?.total || 0,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Chargement du tableau de bord..." />;
  }

  const dashboardCards = [
    {
      title: 'Films',
      count: stats.totalMovies,
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
      ),
      link: '/admin/movies',
      color: 'cyan',
    },
    {
      title: 'Catégories',
      count: stats.totalCategories,
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
      link: '/admin/categories',
      color: 'purple',
    },
    {
      title: 'Utilisateurs',
      count: stats.totalUsers,
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      link: '/admin/users',
      color: 'green',
    },
  ];

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Dashboard Administrateur
          </h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Gérez films, catégories et utilisateurs
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className={`rounded-lg p-6 shadow-lg transition-transform hover:scale-105 ${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {card.title}
                  </p>
                  <p className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {card.count}
                  </p>
                </div>
                <div className={`text-${card.color}-400`}>
                  {card.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className={`rounded-lg p-6 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/movies/new"
              className="flex items-center justify-center px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Ajouter un film
            </Link>
            <Link
              to="/admin/categories/new"
              className="flex items-center justify-center px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Ajouter une catégorie
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Gérer les utilisateurs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
