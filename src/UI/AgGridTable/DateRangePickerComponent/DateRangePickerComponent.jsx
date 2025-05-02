import React from 'react';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import { SlCalendar, SlCalender } from 'react-icons/sl'; // Corrected the icon import
import './DateRangePickerComponent.css';

const DateRangePickerComponent = ({
  label = null, // Added label prop with a default value
  startDate,
  endDate,
  onDatesChange = () => { }, // Prevents breaking if not provided
  focusedInput,
  onFocusChange = () => { } // Prevents breaking if not provided
}) => {
  return (
    <div className="date-range-picker-container" >
      {label && ( // Show label only if it is truthy
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      )}      <DateRangePicker
        startDate={startDate}
        startDateId="start_date"
        endDate={endDate}
        endDateId="end_date"
        onDatesChange={onDatesChange}
        focusedInput={focusedInput}
        onFocusChange={onFocusChange}
        displayFormat="DD-MM-YYYY"
        isOutsideRange={() => false}
        customInputIcon={<SlCalender />}
        inputIconPosition="before"
        numberOfMonths={1}
        hideKeyboardShortcutsPanel={true} // Hides unnecessary shortcuts
        showClearDates={true} // Allows clearing the selection
      />
    </div>
  );
};

export default DateRangePickerComponent;