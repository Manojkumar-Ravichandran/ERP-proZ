import React, { useState } from 'react';
import './TabsPills.css';

export default function TabsPills({ tabs, variant = 'tabs' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className={`tabs-pills-container ${variant} darkCardBg`}>
      <div className="tabs-pills-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-pill ${activeIndex === index ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-pills-content p-2 text-left darkCardBg">
        {tabs[activeIndex] && tabs[activeIndex].content}
      </div>
    </div>
  );
}
