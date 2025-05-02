import React, { useEffect } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './PhoneNumber.css'; // Import your custom CSS file// Import your CSS file for custom styles
const PhoneNumberInput = ({
    id = 'phone',
    label = 'Phone Number',
    defaultCountry = 'IN',
    register,
    setValue,
    trigger,
    getValues,
    errors,
    countries = ["IN", "US", "GB"], // ✅ restrict to allowed countries
    icon = null, // Pass the icon for the button
    onIconClick = () => { }, // Handle button click
    iconLabel,
    showStar = true,
}) => {
    useEffect(() => {
        register(id, {
            required: 'Phone number is required',
            validate: (value) => isValidPhoneNumber(value) || 'Invalid phone number',
        });
    }, [register, id]);

    const handleIconClick = () => {
        const value = getValues(id); // Get the current value of the phone input
        if (isValidPhoneNumber(value)) {
            onIconClick(value); // Call the function with the value if valid
        } else {
            console.error('Invalid phone number'); // Handle invalid phone number case
        }
    };

    return (
        <div className="relative w-full mb-4 ">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {iconLabel && <span className="mr-2">{iconLabel}</span>}
                    {label}
                    {showStar && <span className="text-red-500 text-sm"> *</span>}
                </label>
            )}
            <div className="relative w-full">
                <PhoneInput
                    id={id}
                    countries={countries} // ✅ restrict to allowed countries
                    defaultCountry={defaultCountry}
                    value={getValues(id)}
                    onChange={(value) => {
                        setValue(id, value, { shouldValidate: true });
                        trigger(id);
                    }}
                    className={`block w-full p-2.5 pr-12 h-10 rounded-md border ${errors[id] ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />

                <button
                    type="button"
                    onClick={handleIconClick}
                    className="absolute top-0 right-0 p-2.5 h-full text-sm font-medium bg-secondary-40 rounded-e-lg flex items-center justify-center"
                >
                    {icon || <span className="sr-only">Action</span>}
                </button>
            </div>

            {errors[id] && (
                <p className="mt-1 text-sm text-red-600">{errors[id]?.message}</p>
            )}
        </div>
    );
};

export default PhoneNumberInput;