// TextArea.js
import React from 'react';
import './TextArea.css'
export default function TextArea({ id, label, placeholder, register, validation, errors,
  showStar = true,className,iconLabel

 }) {
  return (
    <div className="form-group">
      {/* <label htmlFor={id} >{label}
      {showStar && <span className="text-red-500 text-sm"> *</span>}
      </label> */}
      {label && (
        <label htmlFor={id}>
          {iconLabel && <span className="">{iconLabel}</span>}
          <span>{label}</span>
          {showStar && <span className="text-red-500 text-sm"> *</span>}
        </label>
      )}
      <textarea
        id={id}
        placeholder={placeholder}
        {...register(id, validation)}
        className={`form-textarea darkCardBg  ${className}`}
        aria-invalid={errors[id] ? "true" : "false"}
      />
      {errors[id] &&showStar&& <span className="error-message">{errors[id].message}</span>}
    </div>
  );
}
