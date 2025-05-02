import React from 'react';
import styles from './FormInput.module.css';

export default function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  register,
  validation = {},
  errors,
  className,
  showStar = true,
  disabled = false,
  upper = false,
  iconLabel,
  max,
  min,
  allowNumbersOnly =false
  
}) {
  // Function to handle the change event and transform input if 'upper' is true
  const handleChange = (e) => {
    let value = e.target.value;
    if (upper) {
      value = value.toUpperCase();
    }
    if (allowNumbersOnly) {
      value = value.replace(/[^0-9]/g, ""); // Restrict to numbers only
    }
    e.target.value = value;
  };

  return (
    <div className={`${styles.inputContainer} ${className}`}>
      {/* <label htmlFor={id}>
        {label}
        {showStar && <span className="text-red-500 text-sm"> *</span>}
      </label> */}
      {label && (
        <label htmlFor={id}>
          {iconLabel && <span className="">{iconLabel}</span>}
          <span>{label}</span>
          {showStar && <span className="text-red-500 text-sm"> *</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`${upper ? styles['uppercase-input'] : ''} ${className || 'w-full'} ${errors[id] ? styles.error : ''}`}
        // className={`${upper ? styles['uppercase-input'] : ''} {className} ${errors[id] ? styles.error : ''}`}
        style={{ borderColor: errors[id] ? 'red' : '#dbdade' }}
        {...(register && register(id, validation))}
        disabled={disabled}
        onInput={handleChange} // Use onInput to update value
        maxLength={max}
        max={max}
        min={min}
      />
      {errors[id] && showStar && (
        <p className={styles.errorMessage}>{errors[id]?.message}</p>
      )}
    </div>
  );
}
