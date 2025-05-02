import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router'
import Breadcrumps from '../../../../UI/Breadcrumps/Breadcrumps';
import FormInput from '../../../../UI/Input/FormInput/FormInput';
import { validationPatterns } from '../../../../utils/Validation';
import SubmitBtn from '../../../../UI/Buttons/SubmitBtn/SubmitBtn';
import FormCard from '../../../../UI/Card/FormCard/FormCard';
import { useDispatch, useSelector } from 'react-redux';
import { updateMatCategoryInprogress, updateMatCategoryInReset } from '../../../../redux/Inventory/Material/Category/CategoryAction';
import AlertNotification from '../../../../UI/AlertNotification/AlertNotification';
import ActionDropdown from "../../../../UI/AgGridTable/ActionDropdown/ActionDropdown";
import icons from '../../../../contents/Icons';
export default function EditCategory() {
  const location = useLocation();
  const initialValues = location?.state ||{};
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState({show:true})
  const {
    register,
    formState: { touchedFields, errors },
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
  } = useForm({ defaultValues: initialValues });
  const {updateCategory} = useSelector((state)=>state.materialCategory);

  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Category", link: "/user/inventory/material/category/" },
    { id: 3, label: "Edit Category" },

    // { id: 3, label: "Add Lead" },
  ];

  const categoryEditHandler=(data)=>{
    dispatch(
      updateMatCategoryInprogress({...data})
    )
  }
  
  useEffect(()=>{
    reset();
    setLoading(false)
    if(updateCategory.success===true){
        setToastData({show:true,message:updateCategory?.data.message, type:"success"});
        dispatch(updateMatCategoryInReset());
        navigate("/user/inventory/material/category");
    }else if(updateCategory.error===true){
        setToastData({show:true,message:updateCategory?.message, type:"error"});
        dispatch(updateMatCategoryInReset());
    }
  },[updateCategory]);
  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };
 
  return (
    <>
      {toastData?.show===true &&<AlertNotification 
        show={toastData?.show} 
        message={toastData?.message} 
        type={toastData?.type} 
        onClose={toastOnclose}

        />}
    {/* <Breadcrumps items={breadcrumbItems} /> */}
     
    <FormCard title="Edit Category">

      <form onSubmit={handleSubmit(categoryEditHandler)}>
      <FormInput
            label="Category Name"
            placeholder="Enter Category Name"
            register={register}
            id="category_name"
            errors={errors}
            validation={{
              required: "Category name is Required",
              pattern: {
                value: validationPatterns.textwithNumberOnly,
                message: "Provide Valid Name",
              },
            }}
          />
          <SubmitBtn label="Edit Category" loading={loading} />
      </form>
      </FormCard>
      
    </>
  )
}
