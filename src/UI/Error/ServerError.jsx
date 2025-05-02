import React from 'react';
import Img from '../../../src/assets/img/500 Internal Server Error-bro.svg'; 
import './Error.css';

export default function ServerError() {
  return (
    <div className="error-container">
      <div className="error-image-container">
        <img src={Img} alt="500 Internal Server Error" className="error-image" />
      </div>
      <div className="error-content">
        <p className="error-title">Internal Server Error</p>
        <p className="pb-3">
          Oops! Something went wrong on our end. Please try again later.
        </p>
        <button className="error-button" onClick={() => window.location.reload()}>
          Refresh Page
        </button>
      </div>
    </div>
  );
}
