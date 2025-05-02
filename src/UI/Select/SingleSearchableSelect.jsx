import React from 'react';
import Select from 'react-select';
import './Select.css';

export default function SingleSearchableSelect({
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
    iconLabel,
    value, // Controlled value prop
    onChange, // onChange handler
}) {
  // Convert the value to the format expected by react-select
  const selectedValue = options.find(option => option.value === value);

  // Handle change event
  const handleChange = (selectedOption) => {
    onChange && onChange(selectedOption ? selectedOption.value : '');
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id}>
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
        <Select
          id={id}
          classNamePrefix="select"
          placeholder={placeholder}
          value={selectedValue}
          onChange={handleChange}
          options={options}
          isDisabled={disabled}
          isSearchable={true}
          isClearable={true}
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: 'transparent',
              borderColor: errors[id] ? '#ef4444' : '#d1d5db',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: upper ? '#fff' : '#000',
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: '#1f2937', // Dark background for dropdown
              color: '#fff', // White text
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? '#374151' : '#1f2937',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#4b5563',
              },
            }),
          }}
        />
      </div>
      {errors[id] && (
        <p className="text-red-500 text-sm">{errors[id]?.message}</p>
      )}
    </div>
  );
}