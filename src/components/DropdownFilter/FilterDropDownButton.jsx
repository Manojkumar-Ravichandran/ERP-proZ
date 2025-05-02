import React, { useEffect, useState, useRef } from "react";
  import styles from "./FilterDropdown.module.css";
  import icons from "../../contents/Icons";

  const FilterDropdownButton = ({
    options,
    onFilter,
    placeholder = "Select a filter",
    value,
    isDropDownButton = false,
    showClearButton = false,
    isDropDownButtonStyles = false,

  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
      handleOptionClick(value);
    }, [value]);

    const handleOptionClick = (value) => {
      const selectedOption = options.find((item) => item.value === value);
      if (selectedOption) {
        setSelectedValue(selectedOption.label);
        onFilter(value);
      }
      setIsOpen(false);
    };

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="relative inline-block min-w-39" ref={dropdownRef}>
        <button

          onClick={toggleDropdown}
          className="block w-full px-10 py-2 bg-white border border-gray-300 rounded-md text-secondary-400 font-medium text-md text-left "
          style={
            isDropDownButtonStyles // Check if the prop is true
              ? { backgroundColor: "var(--primary-color)", color: "white" } // Apply primary styles
              : { backgroundColor: "white", color: "black" } // Apply default styles
          }>
          {placeholder}

        </button>
        {isOpen && (
          <ul
            className={`absolute z-10 w-full text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md mt-2 ${styles.dropdownContainer}`}
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={`${styles["dropdown-item"]} px-4 py-2 cursor-pointer`}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  export default FilterDropdownButton;
