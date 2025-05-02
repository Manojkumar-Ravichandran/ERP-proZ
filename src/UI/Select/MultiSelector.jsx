// import React from 'react';
// import './Select.css';

// export default function MultiSelector({
//   id,
//   label,
//   placeholder,
//   register,
//   validation = {},
//   errors,
//   className = '',
//   showStar = true,
//   disabled = false,
//   upper = false,
//   options = [],
//   isMulti = false,
//   iconLabel,
//   value,
//   onChange,
// }) {
//   return (
//     <div className={className}>
//       {label && (
//         <label htmlFor={id}>
//           {iconLabel && <span>{iconLabel}</span>}
//           <span>{label}</span>
//           {showStar && <span className="text-red-500 text-sm"> *</span>}
//         </label>
//       )}

//       <div
//         className={`darkCardBg custom-select mt-1 ${disabled ? 'disabled' : ''}`}
//       >
//         <select
//           id={id}
//           multiple={isMulti}
//           value={value}
//           onChange={(e) => {
//             const selectedValue = isMulti
//               ? Array.from(e.target.selectedOptions).map((opt) => opt.value)
//               : e.target.value;
//             onChange && onChange(selectedValue);
//           }}
//           className={`darkCardBg w-full ${
//             errors?.[id] ? 'border-red-500' : 'border-gray-300'
//           } ${className}`}
//           {...(register && register(id, { ...validation }))}
//           disabled={disabled}
//         >
//           {!isMulti && (
//             <option value="" disabled>
//               {placeholder}
//             </option>
//           )}
//           {options.map((option) => (
//             <option key={option.value} value={option.value}>
//               {upper ? option.label.toUpperCase() : option.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {errors?.[id] && (
//         <p className="text-red-500 text-sm">{errors[id]?.message}</p>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState, useMemo, useCallback } from "react";
import ReactDropdownSelect from "react-dropdown-select";
import './Select.css';

// import styles from "./SearchableSelect.module.css";

const MultiSearchableSelect = ({
  label,
  id,
  options = [],
  placeholder,
  showStar = true,
  disabled = false,
  upper = false,
  register,
  validation = {},
  errors,
  setValue,
  marginClass,
  defaultValue = [],
  searchable = true,
  multiple = false,
}) => {
  // Memoize options to prevent unnecessary recalculations
  const modifiedOptions = useMemo(
    () => [{ label: placeholder, value: "", disabled: true }, ...options],
    [options, placeholder]
  );

  // Parse default value only once
  const initialValues = useMemo(() => {
    try {
      return JSON.parse(defaultValue) || [];
    } catch {
      return Array.isArray(defaultValue) ? defaultValue : [];
    }
  }, [defaultValue]);

  const [selectedValues, setSelectedValues] = useState(initialValues);

  // Set initial values in the form
  useEffect(() => {
    if (initialValues.length > 0) {
      setValue(id, initialValues);
      setSelectedValues(initialValues);
    }
  }, [initialValues, setValue, id]);

  // Optimized dropdown change handler using useCallback
  const handleDropdownChange = useCallback(
    (selected) => {
      let values = selected.map((option) => option.value);
      if (upper) values = values.map((value) => value.toUpperCase());

      setSelectedValues(values);
      setValue(id, values);
    },
    [setValue, id, upper]
  );

  // Memoized selected options to avoid re-computation
  const selectedOptions = useMemo(
    () =>
      selectedValues.map((value) => ({
        value,
        label: options.find((opt) => opt.value === value)?.label || '',
      })),
    [selectedValues, options]
  );

  return (
    <div >
      {label && (
        <label htmlFor={id} >
          <span>{label}</span>
          {showStar && <span className="text-red-500 text-sm"> *</span>}
          </label>
      )}
      <div>
        <ReactDropdownSelect
          id={id}
          {...register(id, validation)}
          options={modifiedOptions}
          value={selectedOptions}
          values={selectedOptions}
          placeholder={placeholder}
          searchable={searchable}
          disabled={disabled}
          clearable={selectedValues.length > 0}
          clearOnSelect={!multiple}
          multi={multiple}
        //   className={`mt-1 ${styles.darkCardBg} ${styles["searchable-select"]} ${upper ? styles["uppercase-input"] : ""} w-full ${errors[id] ? styles.error : ""}`}
          style={{ borderColor: errors[id] ? "red" : "#dbdade" }}
          onChange={(value) => handleDropdownChange(value.length ? value : [])}
        />
      </div>
      {errors[id] && showStar && <p className="text-error text-md">{errors[id]?.message}</p>}
    </div>
  );
};

export default MultiSearchableSelect;