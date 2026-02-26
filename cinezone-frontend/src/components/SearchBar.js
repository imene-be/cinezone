import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const SelectField = ({ value, onChange, children, theme }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className={`w-full appearance-none pl-4 pr-9 py-3 text-sm rounded-xl border
        focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400
        transition-colors cursor-pointer
        ${theme === 'dark'
          ? 'bg-gray-800 border-gray-700 text-white'
          : 'bg-white border-gray-300 text-gray-900'
        }`}
    >
      {children}
    </select>
    {/* Flèche custom */}
    <svg
      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
);

const SearchBar = ({
  onSearch,
  onFilterChange,
  categories = [],
  placeholder = 'Rechercher un film...',
  initialQuery = '',
  initialFilters = {}
}) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    minRating: initialFilters.minRating || '',
    sort: initialFilters.sort || 'recent'
  });

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
    if (onFilterChange) onFilterChange(newFilters);
  };

  const hasActiveFilters = filters.category || filters.minRating || (filters.sort && filters.sort !== 'recent');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-3">

      {/* ── Barre de recherche principale ── */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-2 transition-all
          focus-within:ring-2 focus-within:ring-cyan-400/50 focus-within:border-cyan-400
          ${theme === 'dark'
            ? 'bg-gray-800/90 border-gray-700'
            : 'bg-white border-gray-300'
          }`}
        >
          {/* Icône loupe */}
          <svg className="w-5 h-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={`flex-1 bg-transparent py-2 text-base focus:outline-none
              ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
          />

          {/* Bouton clear */}
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); onSearch('', filters); }}
              className="flex-shrink-0 text-gray-400 hover:text-gray-200 transition-colors p-1"
              aria-label="Effacer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          {/* Séparateur */}
          <div className={`h-6 w-px flex-shrink-0 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />

          {/* Bouton Rechercher */}
          <button
            type="submit"
            className="flex-shrink-0 bg-cyan-400 hover:bg-cyan-500 text-gray-900 font-semibold
              text-sm px-5 py-2 rounded-lg transition-colors"
          >
            Rechercher
          </button>
        </div>
      </form>

      {/* ── Filtres ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SelectField
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          theme={theme}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </SelectField>

        <SelectField
          value={filters.minRating}
          onChange={(e) => handleFilterChange('minRating', e.target.value)}
          theme={theme}
        >
          <option value="">Note minimum</option>
          {[1,2,3,4,5,6,7,8,9].map((n) => (
            <option key={n} value={n}>{n}+ ★</option>
          ))}
        </SelectField>

        <SelectField
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          theme={theme}
        >
          <option value="recent">Plus récents</option>
          <option value="oldest">Plus anciens</option>
          <option value="title-asc">Titre (A → Z)</option>
          <option value="title-desc">Titre (Z → A)</option>
          <option value="rating">Mieux notés</option>
          <option value="release-date">Date de sortie</option>
        </SelectField>
      </div>

      {/* ── Indicateur filtres actifs ── */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-xs">
          <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>Filtres actifs</span>
          {filters.category && (
            <span className="bg-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded-md">
              {categories.find(c => String(c.id) === String(filters.category))?.name || 'Catégorie'}
            </span>
          )}
          {filters.minRating && (
            <span className="bg-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded-md">
              {filters.minRating}+ ★
            </span>
          )}
          {filters.sort && filters.sort !== 'recent' && (
            <span className="bg-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded-md">
              {{
                oldest: 'Plus anciens',
                'title-asc': 'A → Z',
                'title-desc': 'Z → A',
                rating: 'Mieux notés',
                'release-date': 'Date sortie'
              }[filters.sort]}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
