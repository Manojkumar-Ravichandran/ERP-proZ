import React, { useRef } from "react";
import styles from "./FileInput.module.css";

export default function ButtonFileInput({
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
  // Reference to the hidden file input
  const fileInputRef = useRef(null);

  return (
    <div className={`${styles.inputContainer} ${className}`}>
      {/* Render label with "htmlFor" associated to the file input */}
      {label && (
        <label
          htmlFor={id}
          className="button rounded flex items-center mt-2 button-sec cursor-pointer"
        >
          {iconLabel && <span className="">{iconLabel}</span>}
          <span>{label}</span>
          {showStar && <span className="text-red-500 text-sm"> *</span>}
        </label>
      )}

      {/* File Input (hidden, triggered by clicking the label) */}
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        className={`${className || "w-full"} ${errors[id] ? styles.error : ""}`}
        style={{ borderColor: errors[id] ? "red" : "#dbdade", display: "none" }} // Hide the file input
        {...(register &&
          register(id, {
            ...validation,
            validate: {
              maxSize: (files) => {
                if (!files || files.length === 0) {
                  return true; // Skip validation if no files are uploaded
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
