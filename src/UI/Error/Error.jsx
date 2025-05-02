import React from 'react';
import Img from '../../../src/assets/img/404 Error-rafiki.svg';
import './Error.css';
import { useNavigate } from 'react-router-dom';

export default function Error() {
  const navigate = useNavigate(); 
  const handleHomeRedirect = () =>{
      navigate('/user');
  }
  return (
    <div className="error-container">
      <div className="error-image-container">
        <img src={Img} alt="404 Error" className='error-image' />
      </div>
      <div className="error-content">
        <p className="error-title">Page Not Found</p>
        <p className="pb-3">Oops! 😖 The requested URL was not found on this server.</p>
        <button className="error-button" onClick={handleHomeRedirect}>Go Back Home</button>
      </div>
    </div>
  );
}

// /user/nonexistent
