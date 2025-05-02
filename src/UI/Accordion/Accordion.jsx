import React, { useState } from 'react';
import './Accordion.css';
import icons from "../../contents/Icons";

export default function Accordion({ items, singleOpen = true }) { // Set singleOpen to true
  const [openIndex, setOpenIndex] = useState(null); // Store only one index

  const toggleAccordion = (index) => {
    // Set openIndex to the clicked index or close it if already open
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          <button
            className="accordion-header darkCardBg"
            onClick={() => toggleAccordion(index)}
          >
            {item.title}
            <span className={`icon ${openIndex === index ? 'rotate' : ''}`}>
              {icons.arrowdown}
            </span>
          </button>
          {openIndex === index && (
            <div className="accordion-content darkCardBg">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
