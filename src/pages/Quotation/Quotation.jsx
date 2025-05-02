import React from "react";
import Breadcrumb from "../../UI/Breadcrumps/Breadcrumps";
import IconButton from "../../UI/Buttons/IconButton/IconButton";
import icons from "../../contents/Icons";
import { useNavigate } from "react-router";

export default function Quotation() {
  const navigate = useNavigate()
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Quotation" },
  ];
  return (
    <>
      <div className=" rounded-lg p-2 my-2 bg-white darkCardBg">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div>
        <IconButton
          type="button"
          icon={React.cloneElement(icons.plusIcon, { size: "20px" })}
          label="Add Manual Quotation"
          className="px-4 py-2"
          onClick={()=>{
            console.log("click")
            navigate('/user/quotation/add-manual-quotation')
          }}
        />

      </div>

      <div>Quotations</div>
    </>
  );
}
