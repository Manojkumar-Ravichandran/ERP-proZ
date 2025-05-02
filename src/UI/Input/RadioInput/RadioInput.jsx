// import React from 'react';
// import './RadioInput.css';

// const RadioInput = ({ options, register, name, validation, errors }) => {
//   return (
//     <div className="radio-group">
//       {options.map((option) => (
//         <label key={option.value} className="radio-label">
//           <input
//             type="radio"
//             value={option.value}
//             {...register(name, validation)}
//             className="radio-input"
//           />
//           <span className="radio-custom"></span>
//           {option.label}
//         </label>
//       ))}
//       {errors[name] && <p className="error-message">{errors[name].message}</p>}
//     </div>
//   );
// };

// export default RadioInput;

import React from "react";
import styles from "./RadioInput.css";

export default function RadioInput({
  id,
  label,
  options = [], // Array of radio button options
  register,
  validation = {},
  errors,
  isMultiSelect = false, // Determines single or multi-select
  className,
  showStar = true,
  iconLabel,
  horizontal=false
}) {
  return (
    <div className={`${styles.radioContainer} ${className || ""} radio-group`}>
      {label && (
        <label htmlFor={id}>
          {iconLabel && <span className="">{iconLabel}</span>}
          <span>{label}</span>
          {showStar && <span className="text-red-500 text-sm"> *</span>}
        </label>
      )}
      <div className={` flex ${horizontal?'flex-row items-center':'flex-column'}`}>
        {options.map((option, index) => (
          <label
            key={`${id}-${index}`}
            className="flex items-center space-x-2 cursor-pointer radio-label"
          >
            <input
              type={isMultiSelect ? "checkbox" : "radio"}
              id={`${id}-${index}`}
              value={option.value}
              {...(register && register(id, validation))}
              className={`cursor-pointer ${
                errors[id] ? styles.error : ""
              } accent-primary-600 radio-input`}
            />
            {/* <span className="radio-custom">{option.label}</span> */}
            <span className="radio-custom"></span>
            {option.label}
          </label>
        ))}
      </div>

      {errors[id] && (
        <p className={`${styles.errorMessage} text-red-500 text-sm`}>
          {errors[id]?.message}
        </p>
      )}
    </div>
  );
}
