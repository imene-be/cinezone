import { useTheme } from '../context/ThemeContext';
import Logocz from '../assets/images/Logocz.png';
import Logoczdark from '../assets/images/Logoczdark.png';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`border-t mt-auto ${
      theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-300'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* ---- LOGO + COPYRIGHT ---- */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              {/* Logo image */}
              <img
                src={theme === 'dark' ? Logocz : Logoczdark}
                alt="Cinezone Logo"
                style={{ width: '480px'}}
                className="object-contain mr-4"
              />
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 CineZone. Tous droits réservés.
            </p>
          </div>

          {/* ---- ENTREPRISE ---- */}
          <div>
            <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Entreprise
            </h3>
            <ul className="space-y-2">
              <li><a className={`hover:text-cyan-400 transition ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} href="#">À propos</a></li>
              <li><a className={`hover:text-cyan-400 transition ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} href="#">Carrières</a></li>
              <li><a className={`hover:text-cyan-400 transition ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} href="#">Partenariats</a></li>
            </ul>
          </div>

          {/* ---- AIDE ---- */}
          <div>
            <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Besoin d'aide ?
            </h3>
            <ul className="space-y-2">
              <li><a className={`hover:text-cyan-400 transition ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} href="#">Centre d'aide</a></li>
              <li><a className={`hover:text-cyan-400 transition ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} href="#">FAQ</a></li>
              <li><a className={`hover:text-cyan-400 transition ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} href="#">Support</a></li>
            </ul>
          </div>

          {/* ---- SOCIAL ---- */}
          <div>
            <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Rejoignez-nous
            </h3>

            <div className="flex space-x-4 mb-4">
              {/* Facebook */}
              <a href="#" className={`hover:text-cyan-400 transition ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
