import React from 'react';


import './Header.css';
import icons from '../../content/Icons';


export default function Header() {
  return (
    <header className='header'>
        <div className='flex'>
            <div className='flex-1'>
                <input className='border w-70' />
            </div>
            <div className='flex'>
                {icons.darkModeIcon}
                {icons.lightModeIcon}
                
            </div>
        </div>
      
    </header>
  )
}
