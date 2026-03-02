import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movies, categories } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

const ChevronIcon = ({ direction }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
      d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
  </svg>
);

const CategoryRow = ({ categoryData, theme }) => {
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  const scroll = (dir) => {
    rowRef.current?.scrollBy({ left: dir * 480, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  };

  return (
    <div className="mb-10 group/row">
      <div className="px-4 sm:px-6 lg:px-8 mb-3 flex items-center gap-3">
        <h2 className={`text-xl font-bold tracking-wide ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {categoryData.name.toUpperCase()}
        </h2>
        <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`} />
      </div>

      <div className="relative">

        {canScrollLeft && (
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 top-0 bottom-0 z-20 w-14 flex items-center justify-center
              bg-gradient-to-r from-gray-900/90 to-transparent
              text-white opacity-0 group-hover/row:opacity-100
              transition-opacity duration-200 hover:from-gray-900"
            aria-label="Défiler à gauche"
          >
            <ChevronIcon direction="left" />
          </button>
        )}

        <div
          ref={rowRef}
          onScroll={updateScrollState}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-4 sm:px-6 lg:px-8 snap-x w-full"
        >
          {categoryData.movies.map((movie, i) => (
            <div key={movie.id} className="flex-none w-44 snap-start">
              <MovieCard movie={movie} index={i} />
            </div>
          ))}
        </div>

        {canScrollRight && categoryData.movies.length > 5 && (
          <button
            onClick={() => scroll(1)}
            className="absolute right-0 top-0 bottom-0 z-20 w-14 flex items-center justify-center
              bg-gradient-to-l from-gray-900/90 to-transparent
              text-white opacity-0 group-hover/row:opacity-100
              transition-opacity duration-200 hover:from-gray-900"
            aria-label="Défiler à droite"
          >
            <ChevronIcon direction="right" />
          </button>
        )}
      </div>
    </div>
  );
};

const Catalog = () => {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const loadInitialFilters = () => {

    const urlCategory = searchParams.get('category');
    const urlMinRating = searchParams.get('minRating');
    const urlSort = searchParams.get('sort');
    const urlSearch = searchParams.get('q');

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
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({
    category: initialFilters.category,
    minRating: initialFilters.minRating,
    sort: initialFilters.sort
  });

  useEffect(() => {
    loadMoviesData();
  }, []);

  useEffect(() => {
    const params = {};

    if (searchQuery) params.q = searchQuery;
    if (filters.category) params.category = filters.category;
    if (filters.minRating) params.minRating = filters.minRating;
    if (filters.sort && filters.sort !== 'recent') params.sort = filters.sort;

    setSearchParams(params, { replace: true });

    localStorage.setItem('catalogFilters', JSON.stringify({
      category: filters.category,
      minRating: filters.minRating,
      sort: filters.sort
    }));
  }, [filters, searchQuery, setSearchParams]);

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
        movies.getAll({ limit: 500 }),
        categories.getAll(),
      ]);

      const moviesList = moviesData.movies || moviesData;
      const categoriesList = categoriesData.categories || categoriesData;

      setAllMovies(moviesList);
      setAllCategories(categoriesList);

      const assignedMovieIds = new Set();
      let moviesByCat = [];
      categoriesList.forEach(element => {
        const moviesThisCateg = moviesList.filter((movie) => {
          return movie.categories?.some((cat) => cat.id === element.id);
        });
        if (moviesThisCateg.length > 0) {
          moviesThisCateg.forEach(m => assignedMovieIds.add(m.id));
          moviesByCat.push({ ...element, movies: moviesThisCateg });
        }
      });

      const uncategorized = moviesList.filter(m => !assignedMovieIds.has(m.id));
      if (uncategorized.length > 0) {
        moviesByCat.push({ id: 0, name: 'Tous les films', slug: '_all', movies: uncategorized });
      }

      setMoviesByCategory(moviesByCat);
    } catch (err) {
      setError('Une erreur est survenue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query, currentFilters, page = 1) => {
    setSearchQuery(query);

    if (!query && !currentFilters?.category && !currentFilters?.minRating) {
      setSearchResults(null);
      setPagination({ page: 1, totalPages: 1, total: 0 });
      return;
    }

    try {

      const params = {
        page,
        limit: 12,
        search: query || undefined,
        minRating: currentFilters?.minRating || undefined,
      };

      const data = await movies.search(query || '', params);
      let results = data.movies || data;

      results = applyFilters(results, currentFilters || filters);

      setSearchResults(results);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      setError('Une erreur est survenue');
    }
  };

  const handlePageChange = (newPage) => {
    handleSearch(searchQuery, filters, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    handleSearch(searchQuery, newFilters);
  };

  const applyFilters = (moviesList, currentFilters) => {
    let filtered = [...moviesList];

    if (currentFilters.category) {
      filtered = filtered.filter((movie) =>
        movie.categories?.some((cat) => cat.id === parseInt(currentFilters.category))
      );
    }

    if (currentFilters.minRating) {
      const minRating = parseFloat(currentFilters.minRating);
      filtered = filtered.filter((movie) => movie.averageRating >= minRating);
    }

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

  const moviePosters = [
    'https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    'https://image.tmdb.org/t/p/w300/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    'https://image.tmdb.org/t/p/w300/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
    'https://image.tmdb.org/t/p/w300/ngl2FKBlU4fhbdsrtdom9LVLBXw.jpg',
    'https://image.tmdb.org/t/p/w300/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    'https://image.tmdb.org/t/p/w300/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    'https://image.tmdb.org/t/p/w300/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg',
    'https://image.tmdb.org/t/p/w300/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    'https://image.tmdb.org/t/p/w300/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
    'https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    'https://image.tmdb.org/t/p/w300/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    'https://image.tmdb.org/t/p/w300/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    'https://image.tmdb.org/t/p/w300/sv1xJUazXeYqALzczSZ3O6nkH75.jpg',
    'https://image.tmdb.org/t/p/w300/velWPhVMQeQKcxggNEU8YmIo52R.jpg',
    'https://image.tmdb.org/t/p/w300/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    'https://image.tmdb.org/t/p/w300/6CoRTJTmijhBLJTUNoVSUNxZMEI.jpg',
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>

      <div className="relative h-[60vh] overflow-hidden">

        <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1 opacity-30">
          {[...moviePosters, ...moviePosters, ...moviePosters].map((poster, index) => (
            <div
              key={index}
              className="aspect-[2/3] bg-cover bg-center"
              style={{ backgroundImage: `url(${poster})` }}
            />
          ))}
        </div>

        <div className={`absolute inset-0 bg-gradient-to-b ${
          theme === 'dark'
            ? 'from-transparent from-50% to-gray-900'
            : 'from-transparent from-50% to-gray-100'
        }`} />

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
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

      {error && (
        <div className="px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {searchResults ? (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
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
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4">
                {searchResults.map((movie, i) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    index={i}
                  />
                ))}
              </div>

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
              <p className={`text-center mt-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {pagination.total} film{pagination.total > 1 ? 's' : ''} trouvé{pagination.total > 1 ? 's' : ''}
              </p>
            </>
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

        <div className="pb-12">
          {moviesByCategory.map((categoryData) => (
            <CategoryRow key={categoryData.id} categoryData={categoryData} theme={theme} />
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
    </div>
  );
};

export default Catalog;
