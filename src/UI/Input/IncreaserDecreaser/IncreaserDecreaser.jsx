import React from "react";
import styles from "./IncreaserDecreaser.module.css"
export default function IncreaserDecreaser({
  id,
  label,
  register,
  validation = {},
  errors,
  className,
  value,
  onIncrease,
  onDecrease,
  onChange, // Receive onChange prop to handle manual input changes
  disabled = false,
}) {

    
  return (
    <div className={`mb-3 ${className} darkCardBg`}>
      <label htmlFor={id} className="mr-2">
        {label}
      </label>
      <div className="flex items-center border">
        <button
          type="button"
          onClick={onDecrease}
          className="bg-gray-200 text-black-500 p-1 px-3 mr-2"
          disabled={disabled}
        >
          -
        </button>
        <input
          id={id}
          type="number"
          className={`min-w-5 max-w-20 text-center border-0`}
          {...(register && register(id, validation))}
          disabled={false}
        />
        <button
          type="button"
          onClick={onIncrease}
          className="bg-gray-200 text-black-500 p-1 px-3 ml-2"
          disabled={disabled}
        >
          +
        </button>
      </div>
      {errors && errors[id] && (
        <p className="text-red-500 text-sm mt-1">{errors[id]?.message}</p>
      )}
    </div>
  );
}
