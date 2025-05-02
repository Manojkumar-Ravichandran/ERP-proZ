import React from "react";
import styles from "./FileInput.module.css";

export default function FileInput({
  id,
  label,
  register,
  iconLabel,
  validation = {},
  errors,
  className,
  showStar = true,
  disabled = false,
  accept = "", // Accept specific file types
  multiple = false, // Allow multiple files to be uploaded
  maxSize = 5 * 1024 * 1024, // Default max size: 5MB
}) {
  return (
    <div className={`${styles.inputContainer} ${className}`}>
      {/* Render label if available */}
      {label && (
        <label htmlFor={id}>
                    {iconLabel && <span className="">{iconLabel}</span>}

          <span>{label}</span>
          {showStar && <span className="text-red-500 text-sm"> *</span>}
        </label>
      )}

      {/* File Input */}
      <input
        id={id}
        type="file"
        className={`${className || "w-full"} ${errors[id] ? styles.error : ""}`}
        style={{ borderColor: errors[id] ? "red" : "#dbdade" }}
        {...(register &&
          register(id, {
            ...validation,
            validate: {
              maxSize: (files) => {
                if (!files || files.length === 0) {
                  // Skip validation if no files are uploaded
                  return true;
                }
                return (
                  files[0]?.size <= maxSize ||
                  `File size must be less than ${maxSize / 1024 / 1024} MB`
                );
              },
            },
          }))}
        disabled={disabled}
        accept={accept}
        multiple={multiple} // Allow multiple file selection
      />

      {/* Show error message */}
      {errors[id] && showStar && (
        <p className={styles.errorMessage}>{errors[id]?.message}</p>
      )}
    </div>
  );
}
