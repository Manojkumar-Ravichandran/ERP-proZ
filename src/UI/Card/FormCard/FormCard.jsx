import React from 'react';
import './FormCard.css';

export default function FormCard({ title, subtitle, children }) {
  return (
    <div className="card darkCardBg">
      {title&&<div className="card__header">
        <h2 className="card__title">{title}</h2>
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
      </div>}
      <div className="card__content">
        {children}
      </div>
    </div>
  );
}
