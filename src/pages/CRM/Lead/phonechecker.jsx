import React, { useEffect } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const PhoneNumberInput = ({
  id = 'phone',
  label = 'Phone Number',
  defaultCountry = 'IN',
  register,
  setValue,
  trigger,
  getValues,
  errors,
  icon, // Add an icon prop
  onIconClick, // Add a function prop for the icon click
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
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="relative">
        <PhoneInput
          id={id}
          defaultCountry={defaultCountry}
          value={getValues(id)}
          onChange={(value) => {
            setValue(id, value, { shouldValidate: true });
            trigger(id);
          }}
          className="w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {icon && (
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={handleIconClick} // Trigger the function when the icon is clicked
          >
            {icon}
          </div>
        )}
      </div>

      {errors[id] && (
        <p className="mt-1 text-sm text-red-600">{errors[id]?.message}</p>
      )}
    </div>
  );
};

export default PhoneNumberInput;