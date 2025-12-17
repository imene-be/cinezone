import { useState, useEffect } from 'react';

const SearchBar = ({
  onSearch,
  onFilterChange,
  categories = [],
  placeholder = 'Rechercher un film...',
  initialQuery = '',
  initialFilters = {}
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    minRating: initialFilters.minRating || '',
    sort: initialFilters.sort || 'recent'
  });

  // Mettre à jour les filtres si les props changent
  useEffect(() => {
    if (initialQuery !== undefined) setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (initialFilters) {
      setFilters({
        category: initialFilters.category || '',
        minRating: initialFilters.minRating || '',
        sort: initialFilters.sort || 'recent'
      });
    }
  }, [initialFilters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Barre de recherche */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full px-6 py-4 pl-12 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                onSearch('', filters);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Filtres */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Filtre par catégorie */}
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition-all cursor-pointer"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Filtre par note minimum */}
        <select
          value={filters.minRating}
          onChange={(e) => handleFilterChange('minRating', e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition-all cursor-pointer"
        >
          <option value="">Note minimum</option>
          <option value="1">1+ ⭐</option>
          <option value="2">2+ ⭐</option>
          <option value="3">3+ ⭐</option>
          <option value="4">4+ ⭐</option>
          <option value="5">5+ ⭐</option>
          <option value="6">6+ ⭐</option>
          <option value="7">7+ ⭐</option>
          <option value="8">8+ ⭐</option>
          <option value="9">9+ ⭐</option>
        </select>

        {/* Filtre par tri */}
        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition-all cursor-pointer"
        >
          <option value="recent">Plus récents</option>
          <option value="oldest">Plus anciens</option>
          <option value="title-asc">Titre (A-Z)</option>
          <option value="title-desc">Titre (Z-A)</option>
          <option value="rating">Mieux notés</option>
          <option value="release-date">Date de sortie</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
