import React, { useEffect, useState } from 'react'
import Breadcrumps from '../../../UI/Breadcrumps/Breadcrumps'
import FormInput from '../../../UI/Input/FormInput/FormInput';
import FormCard from '../../../UI/Card/FormCard/FormCard';
import { useForm } from 'react-hook-form';
import { validationPatterns } from '../../../utils/Validation';
import TextArea from '../../../UI/Input/TextArea/TextArea';
import SubmitBtn from '../../../UI/Buttons/SubmitBtn/SubmitBtn';
import { useDispatch, useSelector } from 'react-redux';
import { createUnitInprogress, createUnitInReset, updateUnitInprogress, updateUnitInReset } from '../../../redux/Utils/Unit/UnitAction';
import AlertNotification from '../../../UI/AlertNotification/AlertNotification';
import { useLocation, useNavigate } from 'react-router';


export default function EditUnit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const initialValues = location?.state ||{};
  const {updateUnit}=useSelector(state=>state.unitMaster);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData ] = useState({show:false});
  const {
    register,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
    handleSubmit,
  } = useForm({ defaultValues: initialValues });
 
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Unit", link:"/user/utils/item" },
    { id: 3, label: "Edit Unit" },   
  ];

  useEffect(()=>{
    reset();
    setLoading(false)
    if(updateUnit?.success===true){
        setToastData({show:true,message:updateUnit?.data.message, type:"success"});
        dispatch(updateUnitInReset());
        setTimeout(()=>{
          navigate("/user/utils/unit");

        },3000)
    }else if(updateUnit?.error===true){
        setToastData({show:true,message:updateUnit?.message, type:"error"});
        dispatch(updateUnitInReset());
    }
  },[updateUnit]);

  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };

  const editUnitHandler =(data)=>{
    
    dispatch(updateUnitInprogress({...data}))

  }
  return (
    <>
    {toastData?.show===true &&<AlertNotification 
       show={toastData?.show} 
       message={toastData?.message} 
       type={toastData?.type} 
       onClose={toastOnclose}

       />}
       <Breadcrumps  items={breadcrumbItems}/>
       <FormCard title="Add Unit">
         <form onSubmit={handleSubmit(editUnitHandler)}>
         <div className="grid lg:grid-cols-3 grid-cols-3 gap-4 mt-2">

           <FormInput 
           label="Unit"
           placeholder="Enter Unit"
           register={register}
           id="unit_name"
           errors={errors}
           validation={{
             required: "Unit is Required",
             pattern: {
               minlength: 1,
               message: "Provide Valid Unit",
             },
           }}
           />
           <TextArea 
           label="Description"
           placeholder="Enter ..."
           register={register}
           id="unit_description"
           errors={errors}
           validation={{
             required: false
           }}
           />
         </div>

           <SubmitBtn label="Edit Unit" loading={loading} /> 

         </form>

       </FormCard>

   </>
  )
}
