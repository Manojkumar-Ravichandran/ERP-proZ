import React from 'react';
import Img from '../../../src/assets/img/403 Error Forbidden-rafiki.svg'; 
import './Error.css';
import { useNavigate } from 'react-router-dom';

export default function Forbidden() {
    const navigate = useNavigate(); 
const handleHomeRedirect = () =>{
    navigate('/user');
}
  return (
    <div className="error-container">
      <div className="error-image-container">
        <img src={Img} alt="403 Forbidden" className="error-image" />
      </div>
      <div className="error-content">
        <p className="error-title">Access Denied</p>
        <p className="pb-3">
          Sorry, you don't have permission to access this page.
        </p>
        <button className="error-button" onClick={handleHomeRedirect}>Go Back Home</button>
      </div>
    </div>
  );
}
