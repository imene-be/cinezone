
const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  icon,
  name,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-3
            ${icon ? 'pl-10' : ''}
            bg-gray-800 border border-gray-700
            rounded-lg text-white
            placeholder-gray-500
            focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          `}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;
