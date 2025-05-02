import React from 'react';
import ConstructionImg from "../../assets/img/under-construction-img.jpg"

export default function UnderConstruction() {
  return (
    <div className='w-100 text-center bg-white-50'>
        <img src={ConstructionImg} alt='Construction this page' className='w-1/2 mx-auto' />
    </div>
  )
}
