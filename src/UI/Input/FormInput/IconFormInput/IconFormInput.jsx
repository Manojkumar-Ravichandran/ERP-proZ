import React from "react";
import styles from "../FormInput.module.css";

export default function IconFormInput({
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
  icon = null, // Pass the icon for the button
  onClick = () => {}, // Handle submit or button click
  iconLabel,
  max,
  allowNumbersOnly =false,
  onBlur
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
    <div className={`${styles.inputContainer} relative w-full`}>
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
      <div className="relative w-full">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`${
            upper ? styles["uppercase-input"] : ""
          } ${className || "w-full"} ${
            errors[id] ? styles.error : ""
          } block p-2.5 w-full `}
          style={{ borderColor: errors[id] ? "red" : "#dbdade" }}
          {...(register && register(id, validation))}
          disabled={disabled}
          onInput={handleChange}
          maxLength={max}
          onBlur={onBlur}
        />
        <button
          type="button"
          onClick={onClick}
          className="search_icon absolute top-0 right-0 p-2.5 h-full text-sm font-medium bg-secondary-40 rounded-e-lg flex items-center justify-center"
        >
          {icon || <span className="sr-only">Search</span>}
        </button>
      </div>
      {errors[id] && showStar && (
        <p className={styles.errorMessage}>{errors[id]?.message}</p>
      )}
    </div>
  );
}
