
const Card = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-gray-800 rounded-lg overflow-hidden
        ${hover ? 'hover:bg-gray-750 hover:scale-105 transition-transform duration-300 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
