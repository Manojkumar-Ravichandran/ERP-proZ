// import React, { useState } from 'react';
// import './MultiSelect.css';
// import icons from '../../contents/Icons';

// export default function MultiSelect({
//     id,
//     options = [],
//     label,
//     placeholder = "Select options",
//     register,
//     value = [], // Default value
//     validation = {},
//     errors,
//     className = "",
//     showStar = true,
//     disabled = false,
//     isMulti = true,
//     onChange,
// }) {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [isOpen, setIsOpen] = useState(false);
//     const [selectedValues, setSelectedValues] = useState(value);
//     const [error] = useState("");

//     const filteredOptions = options.filter(option =>
//         option.label.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const handleToggleDropdown = () => {
//         if (!disabled) {
//             setIsOpen(!isOpen);
//         }
//     };

//     const handleSelectOption = (option) => {
//         if (isMulti) {
//             if (!selectedValues.includes(option.value)) {
//                 setSelectedValues([...selectedValues, option.value]);
//             }
//         } else {
//             setSelectedValues([option.value]);
//             setIsOpen(false); // Close dropdown if single selection
//         }
//         setSearchTerm("");
//     };

//     const handleRemove = (optionValue) => {
//         const newSelectedValues = selectedValues.filter(val => val !== optionValue);
//         setSelectedValues(newSelectedValues);
//     };

//     return (
//         <div className={`multi-select-container ${className}`}>
//             {label && (
//                 <label htmlFor={id} className="block">
//                     {label} {showStar && <span className="text-red-500 text-sm">*</span>}
//                 </label>
//             )}
//             <div
//                 id={id}
//                 className={`multi-select ${errors?.[id] ? 'border-red-500' : ''} ${disabled ? 'disabled' : ''}`}
//                 onClick={handleToggleDropdown}
//             >
//                 <div className="selected-values">
//                     {selectedValues.length > 0 ? (
//                         selectedValues.map(val => (
//                             <div key={val} className="selected-value me-1 mb-1 flex items-center justify-between p-1">
//                                 {options.find(option => option.value === val)?.label}
//                                 <span onClick={() => handleRemove(val)} className="remove-button"> &times; </span>
//                             </div>
//                         ))
//                     ) : (
//                         <span>{placeholder}</span>
//                     )}
//                 </div>
//                 <div className="dropdown-icon">{icons.downArrowIcon}</div>
//             </div>
//             {isOpen && (
//                 <div className="dropdown darkCardBg">
//                     <input
//                         type="text"
//                         placeholder="Search..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="search-input"
//                         disabled={disabled}
//                     />
//                     <ul className="options-list">
//                         {filteredOptions.map(option => (
//                             <li
//                                 key={option.value}
//                                 onClick={() => handleSelectOption(option)}
//                                 className={`option ${selectedValues.includes(option.value) ? 'active' : ''}`}
//                             >
//                                 {option.label}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//            {selectedValues.length === 0 && (
//                 <>
//                     {error && <span className="text-red-500 text-sm">{error}</span>} {/* Display error message */}
//                     {errors && errors[id] && <span className="text-red-500 text-sm">{errors[id].message}</span>}
//                 </>
//             )}

//             {/* Hidden input for react-hook-form registration */}
//             <input
//                 type="hidden"
//                 value={selectedValues.length > 0 ? JSON.stringify(selectedValues) : ""} // Pass empty string if no selection
//                 {...(register ? register(id, { required: "This field is required", ...validation }) : {})} // Apply required validation
//             />
//         </div>
//     );
// }
import React, { useEffect, useState } from 'react';
import './MultiSelect.css';
import icons from '../../contents/Icons';

export default function MultiSelect({
    id, iconLabel,
    options = [],
    label,
    placeholder = "Select options",
    register,
    value = [], // Default value
    validation = {},
    errors,
    className = "",
    showStar = true,
    disabled = false,
    isMulti = true,
    onChange, // Add onChange prop
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState(value);
    const [error] = useState("");

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };
    useEffect(() => {
        setSelectedValues(value || []);
    }, [value]);

    const handleSelectOption = (option) => {
        let newSelectedValues;
        if (isMulti) {
            if (!selectedValues.includes(option.value)) {
                newSelectedValues = [...selectedValues, option.value];
                setSelectedValues(newSelectedValues);
            }
        } else {
            newSelectedValues = [option.value];
            setSelectedValues(newSelectedValues);
            setIsOpen(false); // Close dropdown if single selection
        }
        setSearchTerm("");

        // Call the onChange prop with the new selected values
        if (onChange) {
            onChange(newSelectedValues);
        }
    };

    const handleRemove = (optionValue) => {
        const newSelectedValues = selectedValues.filter(val => val !== optionValue);
        setSelectedValues(newSelectedValues);

        // Call the onChange prop with the new selected values
        if (onChange) {
            onChange(newSelectedValues);
        }
    };

    return (
        <div className={`multi-select-container ${className}`}>
            {label && (
                <label htmlFor={id} >
                    {iconLabel && <span>{iconLabel}</span>}
                    <span>{label}</span>
                    {showStar && <span className="text-red-500 text-sm"> *</span>}
                </label>
            )}
            <div
                id={id}
                className={`multi-select ${errors?.[id] ? 'border-red-500' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={handleToggleDropdown}
            >
                <div className="selected-values">
                    {selectedValues.length > 0 ? (
                        selectedValues.map(val => (
                            <div key={val} className="selected-value me-1 mb-1 flex items-center justify-between p-1">
                                {options.find(option => option.value === val)?.label}
                                <span onClick={() => handleRemove(val)} className="remove-button"> &times; </span>
                            </div>
                        ))
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </div>
                <div className="dropdown-icon">{icons.downArrowIcon}</div>
            </div>
            {isOpen && (
                <div className="dropdown darkCardBg">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        disabled={disabled}
                    />
                    <ul className="options-list">
                        {filteredOptions.map(option => (
                            <li
                                key={option.value}
                                onClick={() => handleSelectOption(option)}
                                className={`option ${selectedValues.includes(option.value) ? 'active' : ''}`}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {selectedValues.length === 0 && (
                <>
                    {error && <span className="text-red-500 text-sm">{error}</span>} {/* Display error message */}
                    {errors && errors[id] && <span className="text-red-500 text-sm">{errors[id].message}</span>}
                </>
            )}

            {/* Hidden input for react-hook-form registration */}
            <input
                type="hidden"
                value={selectedValues.length > 0 ? JSON.stringify(selectedValues) : ""} // Pass empty string if no selection
                {...(register ? register(id, { required: "This field is required", ...validation }) : {})} // Apply required validation
            />
        </div>
    );
}