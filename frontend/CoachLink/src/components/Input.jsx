import React from 'react';

const Input = ({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  error,
  name,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-4 py-3 rounded-xl border transition-all duration-200 outline-none
          ${error 
            ? 'border-red-500 bg-red-50 dark:bg-red-900/10' 
            : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-dark-border dark:bg-dark-card dark:focus:border-indigo-400'
          }
          text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500
        `}
      />
      {error && (
        <span className="text-xs font-medium text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
