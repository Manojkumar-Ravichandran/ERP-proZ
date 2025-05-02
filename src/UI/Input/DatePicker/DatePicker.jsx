import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './DatePicker.module.css'; // Optional: custom styles
import { useForm, Controller } from "react-hook-form";

export default function DatePickerInput({ 
  id,
  control, 
  label, 
  placeholder, 
  register, 
  validation = {}, 
  errors, 
  showStar = true, 
  disabled = false,
  maxDate,
  minDate 
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [date, setDate] = React.useState(new Date(Date.now()));

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Register the change with react-hook-form if `register` is passed
    if (register) {
      register(id, validation).onChange({ target: { value: date } });
    }
  };

  return (
    <div className={`${styles.datePickerContainer} mb-3`}>
      <label htmlFor={id}>
        {label}
        {showStar && <span className="text-red-500 text-sm"> *</span>}
      </label>
      {/* <DatePicker
        id={id}
        selected={selectedDate}
        onChange={handleDateChange}
        placeholderText={placeholder}
        className={`w-full ${errors[id] ? styles.error : ''}`}
        disabled={disabled}
        style={{ borderColor: errors[id] ? 'red' : '#dbdade' }}
      /> */}

<div className=''>
<Controller
          name="dateOfBirth"
         
          control={control}
          defaultValue={date}
          render={() => (
            <DatePicker
              selected={date}
              placeholderText="Select date"
              onChange={handleDateChange}
              maxDate={maxDate} // Restricts future dates
              minDate={minDate}
            />
          )}
        />

</div>
      {errors[id] && showStar && (
        <p className={styles.errorMessage}>{errors[id]?.message}</p>
      )}
    </div>
  );
}
