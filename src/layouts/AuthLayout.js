import React, { useEffect } from 'react'
import { Outlet, useNavigate } from "react-router";
import { getUserLocalStorage } from '../utils/utils';

export default function AuthLayout() {
  const navigate =useNavigate();

  useEffect(()=>{
    const token =getUserLocalStorage();
    if(token){
      navigate('/user')
    }
  },[]);

  return (
    <div>
        {Outlet}
      
    </div>
  )
}
