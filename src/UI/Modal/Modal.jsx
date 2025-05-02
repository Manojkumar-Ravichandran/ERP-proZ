import React from 'react';
import './Modal.css';

export default function Modal({
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

  const modalSizeClass = `modal-content-${size}`;

  return (
    <div className="modal-overlay">
      <div className={`modal-content bottom-to-top ${modalSizeClass} ${className}`}>
        {showHeader && (
          <div className="modal-header mb-2">
            <p className="text-lg font-semibold">{title}</p>
            {showCloseButton && (
              <button className="modal-close" onClick={onClose}>
                &times;
              </button>
            )}
          </div>
        )}
        <hr />
        <div className="modal-body mt-4">{children}</div>
        {showFooter && (
          <div className="modal-footer">
            {footerButtons.length > 0 ? (
              footerButtons.map((btn, index) => (
                <button
                  key={index}
                  className={`modal-button ${btn.className || ''}`}
                  onClick={btn.onClick || onClose}
                >
                  {btn.text}
                </button>
              ))
            ) : (
              <button className="modal-button" onClick={onClose}>
                {closeButtonText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
