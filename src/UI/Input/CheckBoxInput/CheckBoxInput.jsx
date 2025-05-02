import React, { useEffect, useState } from 'react';
import './CheckBoxInput.module.css';

export default function CheckBoxInput({
  id,
  options = [],
  selectedValues = [],
  onChange,
  isMultiSelect = false,
  validation = {},
  register,
  errors,
  showStar = true,
  className = ''
}) {
  const [error, setError] = useState("");

  const handleChange = (value) => {
    let newSelectedValues;

    if (isMultiSelect) {
      // Toggle value in the list for multi-select
      newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
    } else {
      // Set single selected value
      newSelectedValues = [value];
    }

    onChange(newSelectedValues);
  };

  // Validate selection on change
  useEffect(() => {
    if (validation.required && selectedValues.length === 0) {
      setError(validation.required);
    } else {
      setError(""); // Clear error if valid
    }
  }, [selectedValues, validation]);

  return (
    <div className={`${className}`}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center text-sm my-2">
          <input
            type="checkbox"
            checked={selectedValues.includes(option.value)}
            onChange={() => handleChange(option.value)}
            disabled={validation.disabled}
          />
          <span className="checkbox-custom"></span>
          {option.label}
        </label>
      ))}
      <input
        type="hidden"
        value={selectedValues.length > 0 ? JSON.stringify(selectedValues) : ""}
        {...(register && register(id, validation))}

      // {...(register ? register(id, { required: validation.required ? "This field is required" : false }) : {})}
      />

      {selectedValues.length === 0 && (
        <>
          {errors && errors[id] && <span className="text-red-500 text-sm">{errors[id].message}</span>}
        </>
      )}
    </div>
  );
}
