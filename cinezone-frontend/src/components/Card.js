
const Card = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-gray-800 rounded-xl overflow-hidden
        ${hover
          ? 'cursor-pointer transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-2xl hover:shadow-black/60 hover:z-10 relative'
          : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
