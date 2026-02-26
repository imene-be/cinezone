import { useTheme } from '../context/ThemeContext';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { theme } = useTheme();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const baseButtonClass = `px-3 py-2 rounded-lg transition-colors font-medium text-sm`;
  const activeClass = theme === 'dark'
    ? 'bg-cyan-500 text-white'
    : 'bg-cyan-500 text-white';
  const inactiveClass = theme === 'dark'
    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  const disabledClass = theme === 'dark'
    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
    : 'bg-gray-100 text-gray-400 cursor-not-allowed';

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-8">
      {/* Bouton Précédent */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseButtonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`}
        aria-label="Page précédente"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Première page si pas visible */}
      {getPageNumbers()[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`${baseButtonClass} ${inactiveClass}`}
          >
            1
          </button>
          {getPageNumbers()[0] > 2 && (
            <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>...</span>
          )}
        </>
      )}

      {/* Numéros de page */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${baseButtonClass} ${page === currentPage ? activeClass : inactiveClass}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Dernière page si pas visible */}
      {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
        <>
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
            <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`${baseButtonClass} ${inactiveClass}`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Bouton Suivant */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseButtonClass} ${currentPage === totalPages ? disabledClass : inactiveClass}`}
        aria-label="Page suivante"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;
