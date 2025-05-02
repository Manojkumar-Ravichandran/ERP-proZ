import React from 'react';
import './Breadcrumps.css'
import icons from "../../contents/Icons";
import { Link } from 'react-router-dom';


export default function Breadcrumps({ items }) {
  return (
    <div className='px-3'>
      <nav className="breadcrumb">
        <ul className="breadcrumb__list">
          {items.map((item, index) => (
            <li key={item?.id} className="breadcrumb__item">
              {item?.link ? (
                <Link to={item?.link} className="breadcrumb__link" state={item?.state}>
                  {item?.label ==="Home"?<>
                  Home</>
                  : <>{item?.label}</>
                  }
                </Link>
              ) : (
                <span className="breadcrumb__current">{item?.label}</span>
              )}
              {index < items?.length - 1 && <span className="breadcrumb__separator white-text"> / </span>}
            </li>
          ))}
        </ul>
      </nav>

    </div>
  );
}
