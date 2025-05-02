import React from "react";

export default function SingleCheckbox({
  id,
  label,
  register,
  validation = {},
  errors,
  className,
  disabled = false,
  textwrap=false
}) {
  return (
    <div className={`flex gap-2 items-center  ${className}`}>
      <input
      className="w-4 checkbox-input"
        type="checkbox"
        id={id}
        {...register(id, validation)} // Integrates with React Hook Form
        disabled={disabled}
      />
      <label htmlFor={id} className={`mb-0 ${disabled ? "cursor-pointer  text-gray-400 shrink w-9/12" : "cursor-pointer shrink w-4/5"} ${textwrap?'text-wrap':'text-nowrap'}`}>
        {label}
      </label>
      {errors?.[id] && (
        <span className="text-red-500 text-sm">{errors[id].message}</span>
      )}
    </div>
  );
}
