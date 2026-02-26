import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { HistoryProvider } from './context/HistoryContext';
import { NotesProvider } from './context/NotesContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import NonAdminRoute from './components/NonAdminRoute';
import MovieDetail from './pages/MovieDetail';
import Watchlist from './pages/Watchlist';
import History from './pages/History';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMovies from './pages/admin/Movies';
import AdminMoviesNew from './pages/admin/MoviesNew';
import AdminMoviesEdit from './pages/admin/MoviesEdit';
import AdminCategories from './pages/admin/Categories';
import AdminCategoriesNew from './pages/admin/CategoriesNew';
import AdminCategoriesEdit from './pages/admin/CategoriesEdit';
import AdminUsers from './pages/admin/Users';
import AdminRoute from './components/AdminRoute';
import MentionsLegales from './pages/MentionsLegales';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <WatchlistProvider>
            <HistoryProvider>
              <NotesProvider>
                <Router>
                <Routes>

          {/* Pages publiques */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mentions-legales" element={<MainLayout><MentionsLegales /></MainLayout>} />

          {/* Pages principales */}
          <Route
            path="/catalog"
            element={
              <NonAdminRoute>
                <MainLayout>
                  <Catalog />
                </MainLayout>
              </NonAdminRoute>
            }
          />


          <Route
            path="/movie/:id"
            element={
              <MainLayout>
                <MovieDetail />
              </MainLayout>
            }
          />

          <Route
            path="/watchlist"
            element={
              <NonAdminRoute>
                <MainLayout>
                  <Watchlist />
                </MainLayout>
              </NonAdminRoute>
            }
          />

          <Route
            path="/history"
            element={
              <NonAdminRoute>
                <MainLayout>
                  <History />
                </MainLayout>
              </NonAdminRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <MainLayout>
                <Profile />
              </MainLayout>
            }
          />

          {/* Admin routes (protected) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/movies"
            element={
              <AdminRoute>
                <MainLayout>
                  <AdminMovies />
                </MainLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/movies/new"
            element={
              <AdminRoute>
                <MainLayout>
                  <AdminMoviesNew />
                </MainLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/movies/edit/:id"
            element={
              <AdminRoute>
                <MainLayout>
                  <AdminMoviesEdit />
                </MainLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <MainLayout>
                  <AdminCategories />
                </MainLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/categories/new"
            element={
              <AdminRoute>
                <MainLayout>
                  <AdminCategoriesNew />
                </MainLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/categories/edit/:id"
            element={
              <AdminRoute>
                <MainLayout>
                  <AdminCategoriesEdit />
                </MainLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <MainLayout>
                  <AdminUsers />
                </MainLayout>
              </AdminRoute>
            }
          />

          {/* Page 404 */}
          <Route
            path="*"
            element={
              <MainLayout>
                <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-cyan-400 mb-4">404</h1>
                    <p className="text-2xl text-white mb-4">Page introuvable</p>
                    <a href="/" className="text-cyan-400 hover:text-cyan-300">
                      Retour à l'accueil
                    </a>
                  </div>
                </div>
              </MainLayout>
            }
          />

            </Routes>
                  </Router>
                </NotesProvider>
              </HistoryProvider>
            </WatchlistProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
  );
}

export default App;
