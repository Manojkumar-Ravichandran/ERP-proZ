import React from 'react';
import "./StateCard.css";

export default function StateCard({children}) {
  return (
    <div className='left-small-border-card shadow-md rounded-2xl py-3 pe-4'>
        <span className='small-border '></span>
        {children}
    </div>
  )
}
