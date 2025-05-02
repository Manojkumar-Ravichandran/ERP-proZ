import React from 'react'
import Breadcrumps from '../../../UI/Breadcrumps/Breadcrumps'
import { H4 } from '../../../UI/Heading/Heading';
import Button from '../../../UI/Buttons/Button/Button';
import { useNavigate } from 'react-router';

export default function Purchase() {
    const navigate = useNavigate()
    const breadcrumbItems = [
        { id: 1, label: "Home", link: "/user" },
        { id: 2, label: "Purchase" },
       
      ];
  return (
    <>
    <Breadcrumps items={breadcrumbItems} />
    <div className="flex justify-between items-center m-4 ">
      <H4 level={6}>Purchase List</H4>
        <Button label="Purchase order Request" onClick={()=>{navigate('/user/inventory/purchase/add-purchase')}} />
      </div>
    </>
  )
}
