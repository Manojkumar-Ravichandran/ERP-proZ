import React, { useEffect } from "react";
import ReactDropdownSelect from "react-dropdown-select";
import styles from "./SearchableSel.module.css";

export default function SearchableSelWimg({
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
    watch,
    defaultValue,
  }) {
    const modifiedOptions = [
      { label: placeholder, value: "", disabled: true },
      ...options,
    ];
  
    // Ensure watch is a function before calling it
    const selectedValue = watch && typeof watch === "function" ? watch(id) : "";
  
    useEffect(() => {
      // Set the default value if provided
      if (defaultValue && !selectedValue) {
        setValue(id, defaultValue);
      } else if (!selectedValue) {
        setValue(id, ""); // Clear the value
      }
    }, [selectedValue, setValue, id, defaultValue]);
  
    const handleDropdownChange = (selected) => {
      setValue(id, selected[0]?.value || "");
    };
  
    return (
      <div
        className={`${styles.inputContainer} w-full ${marginClass ?? "mb-3"} `}
      >
        <label
          htmlFor={id}
          className={`mb-0 ${styles.label}`}
          style={{ paddingBottom: ".25rem" }}
        >
          {label}
          {showStar && <span className="text-red-500 text-sm"> *</span>}
        </label>
        <div className="">
          <ReactDropdownSelect
            id={id}
            options={modifiedOptions}
            placeholder={placeholder}
            searchable
            value={modifiedOptions[2]}
            clearable
            clearOnSelect
            disabled={disabled}
            className={`mt-1 ${styles.darkCardBg} ${
              styles["searchable-select"]
            } ${upper ? styles["uppercase-input"] : ""} w-full ${
              errors[id] ? styles.error : ""
            }`}
            style={{ borderColor: errors[id] ? "red" : "#dbdade" }}
            onChange={handleDropdownChange}
            values={
              selectedValue
                ? [{ value: selectedValue, label: selectedValue }]
                : []
            }
          />
        </div>
        {errors[id] && showStar && (
          <p className={`${styles.errorMessage} text-red-500`}>
            {errors[id]?.message}
          </p>
        )}
      </div>
    );
  };
