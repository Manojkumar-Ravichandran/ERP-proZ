import React from 'react';
import './Card.css';

export default function Card({ title, content, image, footer, style, titleSize, contentSize }) {
  return (
    <div className="card darkCardBg" style={style}>
      {image && (
        <div className="card__image">
          <img src={image} alt={title} />
        </div>
      )}
      {title && <h2 className="card__title" style={{ fontSize: titleSize }}>{title}</h2>}
      {content && <p className="card__content" style={{ fontSize: contentSize }}>{content}</p>}
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}

