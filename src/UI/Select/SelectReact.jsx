// // // // import React from 'react';
// // // // import Select from 'react-select';
// // // // import './Select.css';

// // // // export default function CustomSelect({
// // // //   id,
// // // //   label,
// // // //   placeholder,
// // // //   register,
// // // //   validation = {},
// // // //   errors,
// // // //   className,
// // // //   showStar = true,
// // // //   disabled = false,
// // // //   upper = false,
// // // //   options = [],
// // // //   isMulti = false, // Multi-select support
// // // //   iconLabel,
// // // //   value, // Controlled value prop
// // // //   onChange, // onChange handler
// // // // }) {
// // // //   const customStyles = {
// // // //     control: (base) => ({
// // // //       ...base,
// // // //       borderColor: errors && errors[id] ? 'red' : 'gray',
// // // //       // Additional custom styling can go here
// // // //     }),
// // // //     option: (base) => ({
// // // //       ...base,
// // // //       backgroundColor: 'white',
// // // //       color: 'black',
// // // //     }),
// // // //     // You can add more styles here to customize react-select
// // // //   };

// // // //   return (
// // // //     <div className={className}>
// // // //       {label && (
// // // //         <label htmlFor={id}>
// // // //           {iconLabel && <span>{iconLabel}</span>}
// // // //           <span>{label}</span>
// // // //           {showStar && <span className="text-red-500 text-sm"> *</span>}
// // // //         </label>
// // // //       )}
      
// // // //       {/* react-select component */}
// // // //       <div
// // // //         className={`darkCardBg custom-select mt-1 ${
// // // //           disabled ? 'disabled' : ''
// // // //         } ${className}`}
// // // //       >
// // // //         <Select
// // // //           inputId={id} // Input ID for label association
// // // //           id={id}
// // // //           isMulti={isMulti}
// // // //           value={value} // Controlled value prop
// // // //           onChange={(selectedOption) => {
// // // //             const selectedValue = isMulti
// // // //               ? selectedOption.map((option) => option.value)
// // // //               : selectedOption?.value;
// // // //             onChange && onChange(selectedValue); // Call onChange handler
// // // //           }}
// // // //           options={options}
// // // //           isDisabled={disabled}
// // // //           placeholder={placeholder}
// // // //           styles={customStyles} // Custom styles for react-select
// // // //           {...(register && register(id, { ...validation }))} // React Hook Form registration
// // // //         />
// // // //       </div>
      
// // // //       {/* Display error message if validation fails */}
// // // //       {errors && errors[id] && (
// // // //         <p className="text-red-500 text-sm">{errors[id]?.message}</p>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }



// // // // // import React from 'react';
// // // // // import Select from 'react-select';

// // // // // const CustomSelect = ({
// // // // //   id,
// // // // //   label,
// // // // //   placeholder,
// // // // //   options,
// // // // //   isSearchable = true,
// // // // //   isMulti = false,
// // // // //   value,
// // // // //   onChange,
// // // // //   errors,
// // // // //   register,
// // // // //   validation = {},
// // // // //   disabled = false,
// // // // // }) => {
// // // // //   return (
// // // // //     <div className="select-container">
// // // // //       {label && (
// // // // //         <label htmlFor={id}>
// // // // //           <span>{label}</span>
// // // // //           <span className="text-red-500">*</span>
// // // // //         </label>
// // // // //       )}
// // // // //       <Select
// // // // //         id={id}
// // // // //         value={value}
// // // // //         onChange={onChange}
// // // // //         options={options}
// // // // //         isSearchable={isSearchable}
// // // // //         isMulti={isMulti}
// // // // //         placeholder={placeholder}
// // // // //         isDisabled={disabled}
// // // // //         {...(register && register(id, { ...validation }))} // Validation via react-hook-form
// // // // //       />
// // // // //       {errors[id] && <p className="text-red-500 text-sm">{errors[id]?.message}</p>}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CustomSelect;

// // // import React from 'react';
// // // import Select from 'react-select';
// // // import './Select.css'; // Ensure you have custom styles here

// // // export default function CustomSelect({
// // //   id,
// // //   label,
// // //   placeholder,
// // //   register,
// // //   validation = {},
// // //   errors,
// // //   className,
// // //   showStar = true,
// // //   disabled = false,
// // //   upper = false,
// // //   options = [],
// // //   isMulti = false, // Multi-select support
// // //   iconLabel,
// // //   value, // Controlled value prop
// // //   onChange, // onChange handler
// // // }) {
// // //   // Custom styles for react-select component
// // //   const customStyles = {
// // //     control: (base) => ({
// // //       ...base,
// // //       borderColor: errors && errors[id] ? 'red' : 'gray', // Red border for errors
// // //     }),
// // //     option: (base) => ({
// // //       ...base,
// // //       backgroundColor: 'white',
// // //       color: 'black',
// // //     }),
// // //   };

// // //   // Handle change event for the select input
// // //   const handleChange = (selectedOption) => {
// // //     const selectedValue = isMulti
// // //       ? selectedOption.map((option) => option.value)
// // //       : selectedOption?.value;

// // //     onChange && onChange(selectedValue); // Call the parent onChange handler
// // //   };

// // //   return (
// // //     <div className={className}>
// // //       {/* Display label and optional icon */}
// // //       {label && (
// // //         <label htmlFor={id}>
// // //           {iconLabel && <span>{iconLabel}</span>}
// // //           <span>{label}</span>
// // //           {showStar && <span className="text-red-500 text-sm"> *</span>}
// // //         </label>
// // //       )}
      
// // //       {/* react-select input */}
// // //       <div
// // //         className={`darkCardBg custom-select mt-1 ${disabled ? 'disabled' : ''} ${className}`}
// // //       >
// // //         <Select
// // //           inputId={id} // Unique input ID for label association
// // //           id={id}
// // //           isMulti={isMulti} // Multi-select support
// // //           value={value} // Controlled value passed down
// // //           onChange={handleChange} // Handle selection change
// // //           options={options} // Dynamic options
// // //           isDisabled={disabled} // Disable input if specified
// // //           placeholder={placeholder} // Placeholder text
// // //           styles={customStyles} // Apply custom styles to react-select
// // //           {...(register && register(id, { ...validation }))} // Register with react-hook-form
// // //         />
// // //       </div>
      
// // //       {/* Display error message if validation fails */}
// // //       {errors && errors[id] && (
// // //         <p className="text-red-500 text-sm">{errors[id]?.message}</p>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // import React from 'react';
// // import Select from 'react-select';
// // import './Select.css';

// // export default function CustomSelect({
// //   id,
// //   label,
// //   placeholder,
// //   register,
// //   validation = {},
// //   errors,
// //   className,
// //   showStar = true,
// //   disabled = false,
// //   upper = false,
// //   options = [],
// //   isMulti = false, // Multi-select support
// //   iconLabel,
// //   value, // Controlled value prop
// //   onChange, // onChange handler
// // }) {
// //   // Custom styles for react-select component
// //   const customStyles = {
// //     control: (base) => ({
// //       ...base,
// //       borderColor: errors && errors[id] ? 'red' : 'gray', // Red border for errors
// //     }),
// //     option: (base) => ({
// //       ...base,
// //       backgroundColor: 'white',
// //       color: 'black',
// //     }),
// //   };

// //   // Handle change event for the select input
// //   const handleChange = (selectedOption) => {
// //     const selectedValue = isMulti
// //       ? selectedOption.map((option) => option.value)
// //       : selectedOption?.value;

// //     onChange && onChange(selectedValue); // Call the parent onChange handler
// //   };

// //   return (
// //     <div className={className}>
// //       {/* Display label and optional icon */}
// //       {label && (
// //         <label htmlFor={id}>
// //           {iconLabel && <span>{iconLabel}</span>}
// //           <span>{label}</span>
// //           {showStar && <span className="text-red-500 text-sm"> *</span>}
// //         </label>
// //       )}
      
// //       {/* react-select input */}
// //       <div
// //         className={`darkCardBg custom-select mt-1 ${disabled ? 'disabled' : ''} ${className}`}
// //       >
// //         <Select
// //           inputId={id} // Unique input ID for label association
// //           id={id}
// //           isMulti={isMulti} // Multi-select support
// //           value={value} // Controlled value passed down
// //           onChange={handleChange} // Handle selection change
// //           options={options} // Dynamic options
// //           isDisabled={disabled} // Disable input if specified
// //           placeholder={placeholder} // Placeholder text
// //           styles={customStyles} // Apply custom styles to react-select
// //         />
// //       </div>
      
// //       {/* Display error message if validation fails */}
// //       {errors && errors[id] && (
// //         <p className="text-red-500 text-sm">{errors[id]?.message}</p>
// //       )}
// //     </div>
// //   );
// // }

// import React from 'react';
// import Select from 'react-select';
// import './Select.css';

// export default function CustomSelect({
//   id,
//   label,
//   placeholder,
//   register,
//   validation = {},
//   errors,
//   className,
//   showStar = true,
//   disabled = false,
//   upper = false,
//   options = [],
//   isMulti = false, // Multi-select support
//   iconLabel,
//   value, // Controlled value prop
//   onChange, // onChange handler
// }) {
//   const customStyles = {
//     control: (base) => ({
//       ...base,
//       borderColor: errors && errors[id] ? 'red' : 'gray',
//     }),
//     option: (base) => ({
//       ...base,
//       backgroundColor: 'white',
//       color: 'black',
//     }),
//   };

//   // Handle change event for the select input
//   const handleChange = (selectedOption) => {
//     const selectedValue = isMulti
//       ? selectedOption.map((option) => option.value) // For multi-select, return an array
//       : selectedOption?.value; // For single-select, return the value

//     onChange && onChange(selectedValue); // Call the parent onChange handler
//   };

//   return (
//     <div className={className}>
//       {label && (
//         <label htmlFor={id}>
//           {iconLabel && <span>{iconLabel}</span>}
//           <span>{label}</span>
//           {showStar && <span className="text-red-500 text-sm"> *</span>}
//         </label>
//       )}

//       {/* react-select input */}
//       <div
//         className={`darkCardBg custom-select mt-1 ${disabled ? 'disabled' : ''} ${className}`}
//       >
//         <Select
//           inputId={id} // Unique input ID for label association
//           id={id}
//           isMulti={isMulti} // Multi-select support
//           value={value} // Controlled value passed down (should be in the correct format)
//           onChange={handleChange} // Handle selection change
//           options={options} // Dynamic options
//           isDisabled={disabled} // Disable input if specified
//           placeholder={placeholder} // Placeholder text
//           styles={customStyles} // Apply custom styles to react-select
//         />
//       </div>

//       {/* Display error message if validation fails */}
//       {errors && errors[id] && (
//         <p className="text-red-500 text-sm">{errors[id]?.message}</p>
//       )}
//     </div>
//   );
// }

// import React from "react";
// import Select from "react-select";
// import './Select.css';


// export default function CustomSelect({
//   id,
//   label,
//   placeholder,
//   register,
//   validation = {},
//   errors,
//   className = "",
//   showStar = true,
//   disabled = false,
//   options = [],
//   isMulti = false,
//   isSearchable = false,
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
//             <div
//         className={`darkCardBg custom-select mt-1 ${
//           disabled ? 'disabled' : ''
//         } ${className}`}
//       >

//       <Select
//         id={id}
//         isMulti={isMulti}
//         isDisabled={disabled}
//         isSearchable={isSearchable}
//         options={options}
//         placeholder={placeholder}
//         value={options.find((opt) => opt.value === value)}
//         onChange={(selectedOption) =>
//           onChange(isMulti ? selectedOption.map((opt) => opt.value) : selectedOption?.value)
//         }
//         className={`mt-1 ${errors?.[id] ? "border-red-500" : "border-gray-300"}`}
//       />
// </div>
//       {errors?.[id] && <p className="text-red-500 text-sm">{errors[id]?.message}</p>}
//     </div>
//   );
// }


import React from "react";
import "./Select.css";

export default function CustomSelect({
  id,
  label,
  placeholder,
  register,
  validation = {},
  errors = {},
  className = "",
  showStar = true,
  disabled = false,
  upper = false,
  options = [],
  isMulti = false,
  iconLabel,
  value,
  onChange,
}) {
  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="block text-sm font-medium">
          {iconLabel && <span>{iconLabel}</span>}
          {label}
          {showStar && <span className="text-red-500 text-sm"> *</span>}
        </label>
      )}

      {/* Select Box */}
      <div
        className={`darkCardBg custom-select mt-1 ${disabled ? "disabled" : ""} ${className}`}
      >
        <select
          id={id}
          multiple={isMulti}
          value={value || (isMulti ? [] : "")} // Ensure correct default value
          onChange={(e) => {
            let selectedValue = isMulti
              ? [...e.target.selectedOptions].map((opt) => opt.value)
              : e.target.value;

            // Apply uppercase transformation if needed
            if (upper && selectedValue) {
              selectedValue = isMulti
                ? selectedValue.map((v) => v.toUpperCase())
                : selectedValue.toUpperCase();
            }

            onChange && onChange(selectedValue);
          }}
          className={`darkCardBg w-full ${errors[id] ? "border-red-500" : "border-gray-300"} ${className}`}
          {...(register && register(id, validation))}
          disabled={disabled}
        >
          {!isMulti && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {errors?.[id] && <p className="text-red-500 text-sm">{errors[id]?.message}</p>}
    </div>
  );
}
