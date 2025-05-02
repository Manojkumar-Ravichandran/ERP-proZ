import React from 'react';
import { useNavigate } from 'react-router-dom';
import Img from '../../../src/assets/img/401 Error Unauthorized-rafiki.svg';
import './Error.css';

export default function Unauthorized() {
    const navigate = useNavigate(); 

  const handleLoginRedirect = () => {
    navigate("/auth"); 
  };
  return (
    <div className="error-container">
      <div className="error-image-container">
        <img src={Img} alt="401 Unauthorized" className="error-image" />
      </div>
      <div className="error-content">
        <p className="error-title">Unauthorized Access</p>
        <p className="pb-3">
          Sorry, you need to log in to access this page.
        </p>
        <button className="error-button" onClick={handleLoginRedirect}>Go to Login</button>
      </div>
    </div>
  );
}
