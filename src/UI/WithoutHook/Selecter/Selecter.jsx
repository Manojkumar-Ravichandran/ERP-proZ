import React from 'react';

export default function Selecter({ label, list = [], onChange, value, className = '', id,placeholder }) {
  return (
    <div className="">
      {label && (
        <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`min-w-40 w-full border-2 border-gray-300 rounded-md p-2 ${className}`}
        onChange={onChange}
        value={value}
        placeholder={placeholder || "Select an option"}
      >
        {list.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
