import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Include this line for basic styling

export default function FormCalendar({
  name,
  control,
  register,
  setValue,
  errors,
  validation = {}
}) {
  // Function to handle the change event and set the form value
  const handleDateChange = (date) => {
    setValue(name, date, { shouldValidate: true });
  };

  return (
    <div className="mb-3">
      <label htmlFor={name}>
        {name}
        {validation.required && <span className="text-red-500 text-sm"> *</span>}
      </label>
      <Calendar
        onChange={handleDateChange}
        value={control._formValues[name] || new Date()} // default to current date if not set
      />
      {errors[name] && (
        <p className="text-red-500 text-sm">{errors[name]?.message}</p>
      )}
    </div>
  );
}
