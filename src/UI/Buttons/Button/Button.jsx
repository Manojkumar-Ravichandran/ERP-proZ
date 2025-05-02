import React from 'react';
import './Button.css'

export default function Button(
    {
        type="button",
        label,
        className,
        onClick

    }
) {
  return (
    <button type={type} className={`button button__btn ${className}`} onClick={onClick}>
    {/* <button type={type} className='button button__btn'> */}
      {label}
    </button>
  )
}
