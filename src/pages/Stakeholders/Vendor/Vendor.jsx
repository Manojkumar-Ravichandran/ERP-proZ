import React, { useEffect, useState } from "react";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import { H5 } from "../../../UI/Heading/Heading";
import Button from "../../../UI/Buttons/Button/Button";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { getVendorInprogress } from "../../../redux/Stakeholders/Vendor/VendorAction";
import ActionDropdown from "../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import icons from "../../../contents/Icons";
import ReusableAgGrid from "../../../UI/AgGridTable/AgGridTable";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";


export default function Vendor() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [vendorList, setVendorList] = useState([]);
  const [vendorDetails, setVendorDetails] = useState();
  const [paginationPageSize, setPaginationPageSize] = useState(10); // Default page size

  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Vendor" },
  ];
  const handleAction = (action) => {
    switch (action) {
        case 'view':
          
          break;
        case 'edit':
          
          break;
        case 'delete':
          
          break;
        default:
          
      }
  }
  const handleEdit = (rowData) => {
    navigate("/user/stakeholders/vendor/edit-vendor",{state:rowData})
  };
  const option = [
    { label: 'Add SubCategory', action: 'add-subcategory', icon: icons.viewIcon },
   
  ];
  const columnDefs = [
    { headerName: "Vendor Name", field: "name" },
    { headerName: "Vendor Type", field: "vendor_type" },
    { headerName: "Contact Number", field: "contact" },
    { headerName: "Email", field: "email" },
    { headerName: "State", field: "state_name" },
    { headerName: "District", field: "district_name" },
    {
      headerName: "Action",
      field: "action",
      pinned: "right",
      cellRenderer: (params) => {
        return <div className="flex gap-2">
            <button type="button" data-tooltip-id="edit-category-btn" onClick={()=>(handleEdit(params.data))}>
                {React.cloneElement(icons.editIcon,{size:20})}
            </button>
            <ActionDropdown 
            options={option}
            onAction={handleAction} 
            />
        </div>;
      },
    },
  ];

  useEffect(() => {
    const data = {};
    dispatch(getVendorInprogress({ ...data, callback: getVendorHandler }));
  }, []);
  const getVendorHandler = (data) => {
    
    setVendorDetails(data);
    setVendorList(data.data.data);
    console.log("vendor",vendorList)
  };

  return (
    <>
      <Breadcrumps items={breadcrumbItems} />
      <div className="flex items-center mx-4 my-5 justify-between">
        <H5>Vendor List</H5>
        <IconButton
        icon={icons.plusIcon}
          label="Add Vendor"
          onClick={() => {
            navigate("/user/stakeholders/vendor/add-vendor");
          }}
        />
      </div>
          {vendorList?.length>0&&<ReusableAgGrid 
           key={columnDefs.length}
           rowData={vendorList}
           columnDefs={columnDefs}
           onGridReady={(params) => params.api.sizeColumnsToFit()}
           pagination={false}
           paginationPageSize={paginationPageSize}
          />}
    </>
  );
}
