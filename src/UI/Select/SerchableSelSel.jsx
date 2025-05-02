import React, { useEffect } from 'react';
import ReactDropdownSelect from 'react-dropdown-select';
import styles from './SearchableSel.module.css';
import Select from 'react-select';

const SearchableSelect = ({
  label,
  id,
  options,
  placeholder,
  validation,
  showStar = false,
  disabled = false,
  upper = false,
  register,
  errors,
  setValue,
  marginClass,
  containerClass,
  watch, // Watch function from useForm
  defaultValue, // Add defaultValue prop
}) => {
  const modifiedOptions = [
    { label: placeholder, value: '', disabled: true },
    ...options,
  ];

  // Ensure watch is a function before calling it
  const selectedValue = watch && typeof watch === 'function' ? watch(id) : '';

  useEffect(() => {
    // Set the default value if provided
    if (defaultValue && !selectedValue) {
      setValue(id, defaultValue);
    } else if (!selectedValue) {
      setValue(id, ''); // Clear the value
    }
  }, [selectedValue, setValue, id, defaultValue]);

  const handleDropdownChange = (selected) => {
    setValue(id, selected[0]?.value || '');
  };
  const handleSelectChange = (selectedOption) => {
    setValue(id, selectedOption.value, { shouldValidate: true });
  };


  return (
    <div className={styles.inputContainer}>
      <label htmlFor={id}>Select Flavor</label>
      <Select
        options={options}
        onChange={handleSelectChange}
        classNamePrefix={errors[id] ? 'error' : 'select'}
      />
      <input type="hidden" {...register(id, { required: 'Flavor is required' })} />
      {errors[id] && (
        <p className={styles.errorMessage}>{errors[id].message}</p>
      )}
    </div>
  );
};

export default SearchableSelect;
