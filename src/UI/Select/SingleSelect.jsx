import React from 'react';
import './Select.css';

export default function Select({
    id,
    label,
    placeholder,
    register,
    validation = {},
    errors,
    className,
    showStar = true,
    disabled = false,
    upper = false,
    options = [],
    isMulti = false, // Multi-select support
    iconLabel,
    value, // Controlled value prop
    onChange, // onChange handler
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} >
          {iconLabel && <span>{iconLabel}</span>}
          <span>{label}</span>
          {showStar && <span className="text-red-500 text-sm"> *</span>}
        </label>
      )}
      <div
        className={`darkCardBg custom-select mt-1 ${
          disabled ? 'disabled' : ''
        } ${className}`}
      >
        <select
          id={id}
          multiple={isMulti}
          value={value} // Controlled by parent
          onChange={(e) => {
            const selectedValue = isMulti
              ? [...e.target.selectedOptions].map((opt) => opt.value)
              : e.target.value;
            onChange && onChange(selectedValue); // Call onChange handler
          }}
          className={`darkCardBg w-full ${
            errors[id] ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...(register && register(id, { ...validation }))}
          disabled={disabled}
        >
          <option value="" disabled selected={!value}>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {errors[id] && (
        <p className="text-red-500 text-sm">{errors[id]?.message}</p>
      )}
    </div>
  );
}
