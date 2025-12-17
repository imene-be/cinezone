import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movies, categories } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';

const Catalog = () => {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  // Fonction pour charger les filtres depuis localStorage et URL
  const loadInitialFilters = () => {
    // 1. Essayer de récupérer depuis l'URL (priorité)
    const urlCategory = searchParams.get('category');
    const urlMinRating = searchParams.get('minRating');
    const urlSort = searchParams.get('sort');
    const urlSearch = searchParams.get('q');

    // 2. Sinon, essayer localStorage
    const savedFilters = localStorage.getItem('catalogFilters');
    const localFilters = savedFilters ? JSON.parse(savedFilters) : {};

    return {
      category: urlCategory || localFilters.category || '',
      minRating: urlMinRating || localFilters.minRating || '',
      sort: urlSort || localFilters.sort || 'recent',
      search: urlSearch || ''
    };
  };

  const initialFilters = loadInitialFilters();

  const [moviesByCategory, setMoviesByCategory] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(initialFilters.search);
  const [searchResults, setSearchResults] = useState(null);
  const [filters, setFilters] = useState({
    category: initialFilters.category,
    minRating: initialFilters.minRating,
    sort: initialFilters.sort
  });

  useEffect(() => {
    loadMoviesData();
  }, []);

  // Synchroniser les filtres avec l'URL et localStorage
  useEffect(() => {
    const params = {};

    if (searchQuery) params.q = searchQuery;
    if (filters.category) params.category = filters.category;
    if (filters.minRating) params.minRating = filters.minRating;
    if (filters.sort && filters.sort !== 'recent') params.sort = filters.sort;

    // Mettre à jour l'URL
    setSearchParams(params, { replace: true });

    // Sauvegarder dans localStorage
    localStorage.setItem('catalogFilters', JSON.stringify({
      category: filters.category,
      minRating: filters.minRating,
      sort: filters.sort
    }));
  }, [filters, searchQuery, setSearchParams]);

  // Appliquer les filtres initiaux au chargement
  useEffect(() => {
    if (allMovies.length > 0 && (initialFilters.search || initialFilters.category || initialFilters.minRating)) {
      handleSearch(initialFilters.search, filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMovies.length]);

  const loadMoviesData = async () => {
    try {
      setLoading(true);
      const [moviesData, categoriesData] = await Promise.all([
        movies.getAll(),
        categories.getAll(),
        
      ]);

      const moviesList = moviesData.movies || moviesData;
      const categoriesList = categoriesData.categories || categoriesData;

      // Sauvegarder toutes les données
      setAllMovies(moviesList);
      setAllCategories(categoriesList);

      // Organiser les films par catégorie
      let moviesByCat = []
      categoriesList.forEach(element => {
        const moviesThisCateg = moviesList.filter((movie) =>{
          return movie.categories?.some((cat) => cat.id === element.id)
        })
        moviesByCat.push({
          ...element,
          movies:moviesThisCateg
        })
      });
      setMoviesByCategory(moviesByCat);
      // La watchlist est maintenant gérée par le contexte
    } catch (err) {
      setError('Une erreur est survenue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query, currentFilters) => {
    setSearchQuery(query);

    if (!query && !currentFilters?.category && !currentFilters?.minRating) {
      setSearchResults(null);
      return;
    }

    try {
      let results = [];

      // Recherche par texte
      if (query) {
        const data = await movies.search(query);
        results = data.movies || data;
      } else {
        results = [...allMovies];
      }

      // Appliquer les filtres
      results = applyFilters(results, currentFilters || filters);
      setSearchResults(results);
    } catch (err) {
      setError('Une erreur est survenue');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Réappliquer la recherche avec les nouveaux filtres
    handleSearch(searchQuery, newFilters);
  };

  const applyFilters = (moviesList, currentFilters) => {
    let filtered = [...moviesList];

    // Filtre par catégorie
    if (currentFilters.category) {
      filtered = filtered.filter((movie) =>
        movie.categories?.some((cat) => cat.id === parseInt(currentFilters.category))
      );
    }

    // Filtre par note minimum
    if (currentFilters.minRating) {
      const minRating = parseFloat(currentFilters.minRating);
      filtered = filtered.filter((movie) => movie.averageRating >= minRating);
    }

    // Tri
    if (currentFilters.sort === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt || b.releaseDate) - new Date(a.createdAt || a.releaseDate));
    } else if (currentFilters.sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt || a.releaseDate) - new Date(b.createdAt || b.releaseDate));
    } else if (currentFilters.sort === 'rating') {
      filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (currentFilters.sort === 'title-asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title, 'fr'));
    } else if (currentFilters.sort === 'title-desc') {
      filtered.sort((a, b) => b.title.localeCompare(a.title, 'fr'));
    } else if (currentFilters.sort === 'release-date') {
      filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    }

    return filtered;
  };


  if (loading) {
    return <Loading fullScreen text="Chargement..." />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Section Hero avec recherche */}
      <div className={`relative h-[60vh] bg-gradient-to-b ${
        theme === 'dark' ? 'from-gray-800 to-gray-900' : 'from-gray-200 to-gray-100'
      }`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className={`text-5xl md:text-6xl font-bold mb-8 text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Des milliers de films à découvrir
          </h1>
          <div className="w-full max-w-5xl">
            <SearchBar
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              categories={allCategories}
              initialQuery={searchQuery}
              initialFilters={filters}
            />
          </div>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Résultats de recherche */}
      {searchResults ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {searchQuery ? `Résultats pour "${searchQuery}"` : 'Résultats filtrés'}
            </h2>
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults(null);
                setFilters({ category: '', minRating: '', sort: 'recent' });
                setSearchParams({}, { replace: true });
                localStorage.removeItem('catalogFilters');
              }}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Effacer les filtres
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {searchResults.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className={`text-xl ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Aucun résultat trouvé
              </p>
            </div>
          )}
        </div>
      ) : (
        // Liste des films par catégorie (style Netflix)
        <div className="pb-12">
          {moviesByCategory.map((categoryData) => (
            <div key={categoryData.id} className="mb-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {categoryData.name}
                </h2>
              </div>

              {/* Rangée horizontale scrollable */}
              <div className="relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
                    {categoryData.movies.map((movie) => (
                      <div
                        key={movie.id}
                        className="flex-none w-48 snap-start"
                      >
                        <MovieCard
                          movie={movie}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {moviesByCategory.length === 0 && (
            <div className="text-center py-16 max-w-7xl mx-auto px-4">
              <p className={`text-xl ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Aucun film disponible pour le moment
              </p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Catalog;
