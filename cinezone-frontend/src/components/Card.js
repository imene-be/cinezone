import { useTheme } from '../context/ThemeContext';

const Card = ({ children, className = '', hover = false, onClick }) => {
  const { theme } = useTheme();

  return (
    <div
      onClick={onClick}
      className={`
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'}
        rounded-xl overflow-hidden
        ${hover
          ? 'cursor-pointer transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-2xl hover:shadow-black/30 hover:z-10 relative'
          : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
