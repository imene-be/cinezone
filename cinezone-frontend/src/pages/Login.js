import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(formData.email, formData.password);
      const role = data?.user?.role || data?.role || null;
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/catalog');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="max-w-md w-full space-y-8">
        {/* Logo et titre */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">CINE ZONE</h1>
          <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Connexion
          </h2>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Accédez à votre compte pour continuer
          </p>
        </div>

        {/* Formulaire */}
        <div className={`rounded-lg p-8 shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              }
            />

            <Input
              label="Mot de passe"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          {/* Lien inscription */}
          <div className="mt-6 text-center">
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                className="text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Créer un compte
              </Link>
            </p>
          </div>

          {/* Lien retour */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className={`text-sm ${theme === 'dark' ? 'text-gray-500 hover:text-gray-400' : 'text-gray-600 hover:text-gray-700'}`}
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
