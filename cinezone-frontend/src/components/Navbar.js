import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';
import LogoDark from '../assets/images/Logodark.png';
import Logo from '../assets/images/Logo.png';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const baseUrl = (process.env.REACT_APP_BASE_URL || 'http://localhost:8000').replace(/\/api\/?$/, '');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = isAuthenticated && user?.role !== 'admin'
    ? [
        { name: 'Parcourir', path: '/catalog' },
        { name: 'Ma Liste', path: '/watchlist' },
        { name: 'Historique', path: '/history' },
      ]
    : [];

  return (
    <nav className={`sticky top-0 z-50 border-b ${
      theme === 'dark'
        ? 'bg-gray-900 border-gray-800'
        : 'bg-white border-gray-200'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

                    <div className="flex items-center space-x-8">
            <Link to={isAuthenticated ? '/catalog' : '/'} className="flex items-center">
              <img
                src={theme === 'dark' ? Logo : LogoDark}
                alt="CINE ZONE Logo"
                className="h-10 w-auto object-contain select-none"
              />
            </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium transition-colors relative ${
                  isActive(link.path)
                    ? 'text-cyan-400'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-black'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">

            <button
              onClick={toggleTheme}
              className={`px-2 py-1 rounded-md transition-colors ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {theme === 'dark' ? 'Mode sombre' : 'Mode clair'}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-cyan-400 rounded-full overflow-hidden flex items-center justify-center text-gray-900 font-semibold">
                    {user?.avatar ? (
                      <img src={`${baseUrl}${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      (user?.firstName?.[0] || user?.lastName?.[0])?.toUpperCase() || 'U'
                    )}
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {profileMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl border py-1 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{user?.email}</p>
                    </div>

                    <Link to="/profile" className={`flex items-center px-4 py-2.5 text-sm transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}>
                      Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-4 py-2.5 text-sm text-red-400 transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden py-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'}`}>

            {isAuthenticated && (
              <div className={`px-4 py-3 mb-2 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-cyan-400 rounded-full overflow-hidden flex items-center justify-center text-gray-900 font-semibold">
                    {user?.avatar ? (
                      <img src={`${baseUrl}${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      (user?.firstName?.[0] || user?.lastName?.[0])?.toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user?.role === 'admin' ? 'Administrateur' : 'Membre'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className={`w-full text-left py-2 px-4 text-base font-medium transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-black hover:bg-gray-200'}`}
            >
              {theme === 'dark' ? 'Mode sombre' : 'Mode clair'}
            </button>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 px-4 text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-cyan-400 bg-gray-800'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 hover:text-black hover:bg-gray-200'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-4 text-base font-medium transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-black hover:bg-gray-200'}`}
                >
                  Mon Profil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left py-2 px-4 text-base font-medium text-red-400 transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-4 text-base font-medium transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-black hover:bg-gray-200'}`}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-4 text-base font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
