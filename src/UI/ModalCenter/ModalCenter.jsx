import React from 'react';
import './ModalCenter.css';

export default function ModalCenter({
  isOpen,
  onClose,
  title,
  children,
  showHeader = true,
  showFooter = true,
  closeButtonText = "Close",
  showCloseButton = true,
  footerButtons = [],
  className,
  size = 'm', // Default size is medium
}) {
  if (!isOpen) return null; // Render nothing if modal is not open

  const modalSizeClass = `center-modal-content-${size}`;

  return (
    <div className="center-modal-overlay">
      <div className={`center-modal-content fade-in ${modalSizeClass} ${className}`}>
        {showHeader && (
          <div className="center-modal-header">
            <p className="text-lg font-semibold">{title}</p>
            {showCloseButton && (
              <button className="center-modal-close" onClick={onClose}>
                &times;
              </button>
            )}
          </div>
        )}
        <div className="center-modal-body">{children}</div>
        {showFooter && (
          <div className="center-modal-footer">
            {footerButtons.length > 0 ? (
              footerButtons.map((btn, index) => (
                <button
                  key={index}
                  className={`center-modal-button ${btn.className || ''}`}
                  onClick={btn.onClick || onClose}
                >
                  {btn.text}
                </button>
              ))
            ) : (
              <button className="center-modal-button" onClick={onClose}>
                {closeButtonText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
