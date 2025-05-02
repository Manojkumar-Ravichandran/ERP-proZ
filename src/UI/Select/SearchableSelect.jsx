// // import React, { useState } from 'react';
// // import './SearchableSelect.css';
// // import icons from '../../contents/Icons';

// // export default function SearchableSelect({
// //     id,
// //     options = [],
// //     label,
// //     register,
// //     value = "",
// //     validation = {},
// //     errors,
// //     className = "",
// //     showStar = true,
// //     disabled = false,
// //     onChange,  // <-- New onChange prop
// // }) {
// //     const [searchTerm, setSearchTerm] = useState("");
// //     const [isOpen, setIsOpen] = useState(false);
// //     const [selectedValue, setSelectedValue] = useState(value);

// //     const filteredOptions = options.filter(option =>
// //         option.label.toLowerCase().includes(searchTerm.toLowerCase())
// //     );

// //     const handleToggleDropdown = () => {
// //         if (!disabled) {
// //             setIsOpen(!isOpen);
// //         }
// //     };

// //     const handleSelectOption = (option) => {
// //         
// //         setSelectedValue(option.value);
// //         setSearchTerm(option.label); // Set input field value
// //         setIsOpen(false); // Close dropdown

// //         // Call the passed onChange function
// //         if (onChange) {
// //             onChange(option);  // Notify parent component
// //         }
// //     };

// //     return (
// //         <div className={`select-container ${className}`}>
// //             {label && (
// //                 <label htmlFor={id} className="block">
// //                     {label} {showStar && <span className="text-red-500 text-sm">*</span>}
// //                 </label>
// //             )}
// //             <div className={`searchable-select darkCardBg ${errors && errors[id] ? 'border-red-500' : ''} ${disabled ? 'disabled' : ''}`}>
// //                 <input
// //                     type="text"
// //                     placeholder="Search..."
// //                     value={searchTerm}
// //                     onChange={(e) => setSearchTerm(e.target.value)}
// //                     className="search-input"
// //                     disabled={disabled}
// //                     onClick={handleToggleDropdown}
// //                 />
// //                 <div className="dropdown-icon pe-3">{icons.downArrowIcon}</div>
// //             </div>
// //             {isOpen && (
// //                 <div className="dropdown darkCardBg">
// //                     <ul className="options-list">
// //                         {filteredOptions.length > 0 ? (
// //                             filteredOptions.map(option => (
// //                                 <li
// //                                     key={option.value}
// //                                     onClick={() => handleSelectOption(option)}
// //                                     className={`option ${selectedValue === option.value ? 'active' : ''}`}
// //                                 >
// //                                     {option.label}
// //                                 </li>
// //                             ))
// //                         ) : (
// //                             <li className="no-options">No options found</li>
// //                         )}
// //                     </ul>
// //                 </div>
// //             )}

// //             {/* Hidden input for react-hook-form registration */}
// //             <input
// //                 type="hidden"
// //                 value={selectedValue}
// //                 {...(register ? register(id, { ...validation }) : {})}
// //             />
// //         </div>
// //     );
// // }


// import React, { useState } from 'react';
// import './SearchableSelect.css';
// import icons from '../../contents/Icons';

// export default function SearchableSelect({
//     placeholder,
//     upper = false,
//     id,
//     options = [],
//     label,
//     register,
//     value = "",
//     validation = {},
//     errors = {},
//     setValue, // Ensure setValue is available
//     className = "",
//     showStar = true,
//     disabled = false,
//     onChange,
//     iconLabel
// }) {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [isOpen, setIsOpen] = useState(false);
//     const [selectedValue, setSelectedValue] = useState(value);

//     const filteredOptions = options.filter(option =>
//         option.label.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const handleToggleDropdown = () => {
//         if (!disabled) {
//             setIsOpen(!isOpen);
//         }
//     };

//     const handleSelectOption = (option) => {
//         
//         setSelectedValue(option.value);
//         setSearchTerm(option.label);
//         setIsOpen(false);

//         if (onChange) {
//             onChange(option);
//         }

//         if (register && setValue) {
//             setValue(id, option.value); // Ensure form value is updated
//         }
//     };
//     const handleClearSelection = () => {
//         setSelectedValue("");
//         setSearchTerm(""); // Ensure searchTerm is reset
//         setIsOpen(false);

//         if (onChange) {
//             onChange({ value: "", label: "" }); // Pass an empty object instead of null
//         }

//         if (register && setValue) {
//             setValue(id, ""); // Clear form value
//         }
//     };

//     return (
//         <div className={`select-container ${className}`}>
//              {label && (
//         <label htmlFor={id} >
//           {iconLabel && <span>{iconLabel}</span>}
//           <span>{label}</span>
//           {showStar && <span className="text-red-500 text-sm"> *</span>}
//         </label>
//       )}
//             <div className={`searchable-select darkCardBg ${errors?.[id] ? 'border-red-500' : ''} ${disabled ? 'disabled' : ''}`}>
//                 <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="search-input"
//                     disabled={disabled}
//                     onClick={handleToggleDropdown}
//                 />
//                 {selectedValue && (
//                     <button className="clear-btn" onClick={handleClearSelection}> {React.cloneElement(icons.closeicon, { size: "18px" })}         </button>
//                 )}
//                 <div className="dropdown-icon pe-3">{icons.downArrowIcon}</div>
//             </div>
//             {isOpen && (
//                 <div className="dropdown darkCardBg">
//                     <ul className="options-list">
//                         {filteredOptions.length > 0 ? (
//                             filteredOptions.map(option => (
//                                 <li
//                                     key={option.value}
//                                     onClick={() => handleSelectOption(option)}
//                                     className={`option ${selectedValue === option.value ? 'active' : ''}`}
//                                 >
//                                     {option.label}
//                                 </li>
//                             ))
//                         ) : (
//                             <li className="no-options">No options found</li>
//                         )}
//                     </ul>
//                 </div>
//             )}

//             {/* Hidden input for react-hook-form registration */}
//             {/* <input
//                 type="hidden"
//                 value={selectedValue}
//                 {...(register ? register(id, { ...validation }) : {})}
//             /> */}
//         </div>
//     );
// }

import React, { useState } from "react";
import "./SearchableSelect.css";
import icons from "../../contents/Icons";

export default function SearchableSelect({
  placeholder = "Search...",
  upper = false,
  id,
  options = [],
  label,
  register,
  value = "",
  validation = {},
  errors = {},
  setValue, // Ensure setValue is available
  className = "",
  showStar = true,
  disabled = false,
  onChange,
  iconLabel,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  // Ensure safe filtering to avoid 'undefined' errors
  const filteredOptions = options.filter(
    (option) => option?.label?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  const handleToggleDropdown = () => {
    if (!disabled && options.length > 0) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelectOption = (option) => {
    
    setSelectedValue(option.value);
    setSearchTerm(option.label);
    setIsOpen(false);

    if (onChange) {
      onChange(option);
    }

    if (register && setValue) {
      setValue(id, option.value); // Ensure form value is updated
    }
  };

  const handleClearSelection = () => {
    setSelectedValue("");
    setSearchTerm("");
    setIsOpen(false);

    if (onChange) {
      onChange({ value: "", label: "" });
    }

    if (register && setValue) {
      setValue(id, "");
    }
  };

  const handleKeyDown = (e) => {
    const index = filteredOptions.findIndex((opt) => opt.value === selectedValue);
    
    if (e.key === "ArrowDown" && index < filteredOptions.length - 1) {
      e.preventDefault();
      handleSelectOption(filteredOptions[index + 1]);
    } else if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault();
      handleSelectOption(filteredOptions[index - 1]);
    } else if (e.key === "Enter") {
      setIsOpen(false);
    }
  };

  return (
    <div className={`select-container ${className}`}>
      {label && (
        <label htmlFor={id}>
          {iconLabel && <span>{iconLabel}</span>}
          <span>{label}</span>
          {showStar && <span className="text-red-500 text-sm"> *</span>}
        </label>
      )}
      <div
        className={`searchable-select darkCardBg ${
          errors?.[id] ? "border-red-500" : ""
        } ${disabled ? "disabled" : ""}`}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          disabled={disabled}
          onClick={handleToggleDropdown}
          onKeyDown={handleKeyDown}
        />
        {selectedValue && (
          <button
            className="clear-btn"
            onClick={handleClearSelection}
            aria-label="Clear selection"
          >
            {React.cloneElement(icons.closeicon, { size: "18px" })}
          </button>
        )}
        <div className="dropdown-icon pe-3">{icons.downArrowIcon}</div>
      </div>
      {isOpen && (
        <div className="dropdown darkCardBg">
          <ul className="options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelectOption(option)}
                  className={`option ${
                    selectedValue === option.value ? "active" : ""
                  }`}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="no-options">No options found</li>
            )}
          </ul>
        </div>
      )}
  {errors[id] && (
        <p className="text-red-500 text-sm">{errors[id]?.message}</p>
      )}
      {/* Hidden input for react-hook-form registration */}
      <input
        type="hidden"
        {...(register && id ? register(id, validation) : {})}
        value={selectedValue}
      />
    </div>
  );
}

