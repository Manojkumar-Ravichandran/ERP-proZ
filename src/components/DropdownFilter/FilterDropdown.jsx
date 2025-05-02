  // import React, { useEffect, useState, useRef } from "react";
  // import styles from "./FilterDropdown.module.css";
  // import icons from "../../contents/Icons";

  // const FilterDropdown = ({
  //   options,
  //   onFilter,
  //   placeholder = "Select a filter",
  //   value
  // }) => {
  //   const [isOpen, setIsOpen] = useState(false);
  //   const [selectedValue, setSelectedValue] = useState("");
  //   const dropdownRef = useRef(null);

  //   useEffect(() => {
  //     handleOptionClick(value);
  //   }, [value]);

  //   const handleOptionClick = (value) => {
  //     const selectedOption = options.find((item) => item.value === value);
  //     if (selectedOption) {
  //       setSelectedValue(selectedOption.label);
  //       onFilter(value); // Notify parent about the selected value
  //     }
  //     setIsOpen(false); // Close the dropdown
  //   };

  //   const toggleDropdown = () => setIsOpen((prev) => !prev);

  //   useEffect(() => {
  //     const handleClickOutside = (event) => {
  //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //         setIsOpen(false);
  //       }
  //     };

  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => document.removeEventListener("mousedown", handleClickOutside);
  //   }, []);

  //   return (
  //     <div className="relative inline-block min-w-40" ref={dropdownRef}>
  //       <button
  //         onClick={toggleDropdown}
  //         className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-secondary-400 font-medium text-md text-left"
  //       >
  //         {selectedValue || placeholder}
  //         <span className="absolute right-4 top-1/2 flex items-center gap-3 transform -translate-y-1/2">
  //       <span>{icons?.downArrowIcon}</span>
  //       <button
  //         onClick={(e) => {
  //           e.stopPropagation(); // Prevents triggering `toggleDropdown`
  //           setSelectedValue(""); // Clear the selected value
  //         }}
  //         className="focus:outline-none"
  //       >
  //         {icons?.clear}
  //       </button>
  //     </span>

  //       </button>
  //       {isOpen && (
  //         <ul className={`absolute z-10 w-full text-gray-700 bg-white border border-gray-300 rounded-lg  shadow-md mt-2 ${styles.dropdownContainer}`}>
  //           {options.map((option) => (
  //             <li
  //               key={option.value}
  //               className={`${styles["dropdown-item"]} px-4 py-2 cursor-pointer`}
  //               onClick={() => handleOptionClick(option.value)}
  //             >
  //               {option.label}
  //             </li>
  //           ))}
  //         </ul>
  //       )}
  //     </div>
  //   );
  // };

  // export default FilterDropdown;

  import React, { useEffect, useState, useRef } from "react";
  import styles from "./FilterDropdown.module.css";
  import icons from "../../contents/Icons";

  const FilterDropdown = ({
    options,
    onFilter,
    placeholder = "Select a filter",
    value,
    isDropDownButton = false,
    showClearButton = false,
    isDropDownButtonStyles = false,
    label = null,

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
      <div className="relative inline-block min-w-40 " ref={dropdownRef}>
         {label && ( // Conditionally render the label if it is provided
        <label className="block text-sm font-medium text-black-700 mb-1 ml-1">
          {label}
        </label>)}
        <button
          onClick={toggleDropdown}
          className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-secondary-400 font-medium text-md text-left "
          style={
            isDropDownButtonStyles // Check if the prop is true
              ? { backgroundColor: "var(--primary-color)", color: "white" } // Apply primary styles
              : { backgroundColor: "white", color: "black" } // Apply default styles
          }>
            <div className="flex items-center gap-3 relative w-full">
    {isDropDownButton && <span>{icons?.downArrowIcon}</span>}
    
    <span>{selectedValue || placeholder}</span>

    {/* Push this span to the end using 'ml-auto' */}
    <span className="flex items-center gap-2 ml-auto">  
      <span>{icons?.downArrowIcon}</span>

      {showClearButton && selectedValue && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedValue("");
            onFilter("");
          }}
          className="focus:outline-none"
        >
         x {/* {icons?.clear} */}
        </button>
      )}
    </span>
  </div>


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

  export default FilterDropdown;
