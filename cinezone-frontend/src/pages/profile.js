import { useState, useEffect } from 'react';
import { user as userApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useHistory } from '../context/HistoryContext';
import { useNotes } from '../context/NotesContext';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ConfirmDialog from '../components/ConfirmDialog';

const Profile = () => {
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();
  const { watchlist } = useWatchlist();
  const { getHistoryCount } = useHistory();
  const { getNotesCount } = useNotes();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [success, setSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [showProfileConfirm, setShowProfileConfirm] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowProfileConfirm(true);
  };

  const confirmProfileSubmit = async () => {
    setLoading(true);

    try {
      const data = await userApi.updateProfile(formData);
      updateUser(data.user);
      setSuccess('Profil mis à jour avec succès');
    } catch (err) {
      setError(err?.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    setShowPasswordConfirm(true);
  };

  const confirmPasswordSubmit = async () => {
    setPasswordLoading(true);

    try {
      await userApi.updatePassword(passwordData);
      setPasswordSuccess('Mot de passe modifié avec succès');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      setPasswordError(err?.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) return <Loading fullScreen />;

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Mon Profil
        </h1>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Gérez vos informations personnelles
        </p>

        <div className={`rounded-lg p-8 shadow-xl mt-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>

          {/* Avatar */}
          <div className="flex items-center mb-8">
            <div className="w-24 h-24 bg-cyan-400 rounded-full flex items-center justify-center text-gray-900 text-4xl font-bold">
              {(user.firstName?.[0] || user.lastName?.[0])?.toUpperCase()}
            </div>
            <div className="ml-6">
              <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {user.firstName} {user.lastName}
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
            </div>
          </div>

          {/* --------  INFOS PERSONNELLES -------- */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {success && (
              <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Prénom"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Nom"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            {/* EMAIL NON MODIFIABLE */}
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="cursor-not-allowed opacity-60"
            />

            <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </form>

          {/* --------  CHANGER MOT DE PASSE -------- */}
          <div className={`mt-12 pt-8 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Changer le mot de passe
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">

              {passwordSuccess && (
                <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
                  {passwordSuccess}
                </div>
              )}
              {passwordError && (
                <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                  {passwordError}
                </div>
              )}

              <Input
                label="Mot de passe actuel"
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />

              <Input
                label="Nouveau mot de passe"
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />

              <Input
                label="Confirmer le nouveau mot de passe"
                type="password"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                required
              />

              <Button type="submit" variant="primary" fullWidth disabled={passwordLoading}>
                {passwordLoading ? 'Modification...' : 'Changer le mot de passe'}
              </Button>
            </form>
          </div>

          {/* --------  STATISTIQUES (Cachées pour les administrateurs) -------- */}
          {user.role !== 'admin' && (
            <div className={`mt-8 pt-8 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
              <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Statistiques
              </h3>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <p className="text-3xl font-bold text-cyan-400">{watchlist.length}</p>
                  <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Films dans ma liste
                  </p>
                </div>

                <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <p className="text-3xl font-bold text-cyan-400">
                    {getHistoryCount()}
                  </p>
                  <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Films regardés
                  </p>
                </div>

                <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <p className="text-3xl font-bold text-cyan-400">
                    {getNotesCount()}
                  </p>
                  <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Notes données
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Confirmation Dialogs */}
        <ConfirmDialog
          isOpen={showProfileConfirm}
          onClose={() => setShowProfileConfirm(false)}
          onConfirm={confirmProfileSubmit}
          title="Confirmer les modifications"
          message="Êtes-vous sûr de vouloir enregistrer ces modifications à votre profil ?"
          confirmText="Enregistrer"
          confirmColor="blue"
        />

        <ConfirmDialog
          isOpen={showPasswordConfirm}
          onClose={() => setShowPasswordConfirm(false)}
          onConfirm={confirmPasswordSubmit}
          title="Confirmer le changement de mot de passe"
          message="Êtes-vous sûr de vouloir changer votre mot de passe ?"
          confirmText="Changer"
          confirmColor="blue"
        />
      </div>
    </div>
  );
};

export default Profile;
