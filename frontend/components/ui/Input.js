/**
 * Elite Input Component with Cinematic Styling
 */
import React from "react";

const Input = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = "",
  autoComplete,
  ...props
}) => {
  // Infer autoComplete if not provided
  let resolvedAutoComplete = autoComplete;
  if (resolvedAutoComplete === undefined) {
    switch (type) {
      case "email":
        resolvedAutoComplete = "email";
        break;
      case "password":
        resolvedAutoComplete = "current-password";
        break;
      case "text":
        resolvedAutoComplete = "on";
        break;
      default:
        resolvedAutoComplete = "on";
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-bold text-gray-400 mb-2 ml-1 uppercase tracking-[0.15em] text-[10px]"
        >
          {label} {required && <span className="text-brand-500">*</span>}
        </label>
      )}
      <div className="relative group">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={resolvedAutoComplete}
          className={`w-full px-5 py-4 glass-input rounded-2xl focus:outline-none transition-all duration-500 placeholder-gray-600 bg-black/40 backdrop-blur-xl border-white/10 hover:border-brand-500/30 text-white font-medium ${error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "focus:ring-2 focus:ring-brand-500/30"
            } ${className}`}
          {...props}
        />
        <div className="absolute inset-0 rounded-2xl bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
      {error && (
        <p className="mt-2 text-[10px] text-red-500 font-black uppercase tracking-widest animate-fade-in ml-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
