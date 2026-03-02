import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logocz from '../assets/images/Logocz.png';
import Logoczdark from '../assets/images/Logoczdark.png';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`border-t mt-auto ${
      theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-300'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center text-center gap-3">
        <img
          src={theme === 'dark' ? Logocz : Logoczdark}
          alt="Cinezone Logo"
          style={{ width: '220px' }}
          className="object-contain"
        />
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          © 2025 Bentifraouine Imène - Tous droits réservés.
        </p>
        <Link
          to="/mentions-legales"
          className={`text-sm hover:text-cyan-400 transition ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
        >
          Mentions légales
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
