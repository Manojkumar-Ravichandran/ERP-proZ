import React, { useState, useEffect } from 'react';
import Select from 'react-select';

export default function SelectSearchable({
  label,
  placeholder,
  options = [],
  defaultValue = null,
  isDisabled = false,
  isLoading = false,
  isSearchable = true,
  onChange,
  error,
  errorMsg
}) {
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [option, setOption] = useState([{}]);

  useEffect(() => {
    setSelectedOption(defaultValue);
  }, [defaultValue]);

  const handleChange = (option) => {
    setSelectedOption(option);
    if (onChange) onChange(option);  // Pass selected option to parent if handler is provided
  };

  return (
    <div className="select-container">
      {label && <label className="block mb-1">{label}</label>}
      <Select
        className="basic-single"
        classNamePrefix="select"
        value={selectedOption}
        onChange={handleChange}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isSearchable={isSearchable}
        options={options}
        placeholder={placeholder}  // Added placeholder here
      />
      {error&&<span className='text-red-500 text-sm'>{errorMsg}</span>}
    </div>
  );
}
