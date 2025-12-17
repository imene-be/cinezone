import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const AdminHeader = ({ title, subtitle, showBackButton = true }) => {
  const { theme } = useTheme();

  return (
    <div className="mb-8">
      {showBackButton && (
        <Link
          to="/admin"
          className={`inline-flex items-center mb-4 text-sm font-medium ${
            theme === 'dark' ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'
          } transition-colors`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Accueil
        </Link>
      )}
      <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h1>
      {subtitle && (
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default AdminHeader;
