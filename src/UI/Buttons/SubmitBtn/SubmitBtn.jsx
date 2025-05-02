import React from 'react';
import styles from './SubmitBtn.module.css';

export default function SubmitBtn({
  loading = false,
  type = "submit",
  onClick,
  label,
  icon = null, // Optional icon prop
  className,
  ...props
}) {
  return (
    <button
      type={type}
      className={`submitButton ${styles.submitButton} ${className} btn__sm`}
      disabled={loading}
      {...props}
      onClick={onClick}
    >
      {loading ? (
        <>
          <span className={`${styles.spinner} spinner`}></span> Loading...
        </>
      ) : (
        <>
          {icon && <span className="me-1">{icon}</span>} {/* Render icon if provided */}
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
