import React, { useEffect } from 'react';
import './AlertNotification.css';

export default function AlertNotification({ show, message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (show) {
      
      const timer = setTimeout(() => {
        
        if (onClose) {
          onClose();
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);
  
  return (
    <div className={`alert-notification ${type}`}>
      <span className="alert-message">{message || 'No message provided'}</span>
      <button className="alert-close" onClick={onClose}>&times;</button>
    </div>
  );
}
