import React, { useEffect, useState } from "react";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import { useForm } from "react-hook-form";
import icons from "../../../contents/Icons";
import Select from "../../../UI/Select/SingleSelect";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { pichList, roofModal } from "../../../contents/Qutoation/RoofData";
import { ACopeCal } from "../../../utils/QuotationCalculation/ACope";

export default function ACopeQuot() {
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 3, label: "Add Quotation" },
  ];
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm();
  const [roofModals, setRoofModals] = useState([]);
  const [roofPitchList, setRoofPitchList] = useState([]);
  useEffect(() => {
    const modalList = roofModal.map((item) => ({
      ...item,
      value: item.id,
      label: item.name,
    }));
    setRoofModals(modalList);
    const pitchlists = pichList.map((item) => ({
        ...item,
        value: item.name,
        label: item.name,
    }));
      
    setRoofPitchList(pitchlists);
  }, []);

  const watchRoofModal = watch("roof-modal");
  const length = watch("length");
  const width = watch("width");
  const height = watch("height");
  const side = watch("side");
  const roofLength = watch("roof-length");
  const roofWidth = watch("roof-width");
  const roofPitch = watch("roof-picth");
  const rodLength = watch("rod-length");
  const hCupLength = watch("hcup-length");
  const pillarLength = watch("pillar-length");

  useEffect(() => {
    // if(length && width && height && side && roofLength && roofWidth &&roofPitch){
    //     if(watchRoofModal){
            const payload ={
                length,
                width,
                height,
                side,
                roofModal:watchRoofModal,
                roofLength,
                roofWidth,
                roofPitch,
                rodLength,
                hCupLength,
                pillarLength
            }
            ACopeCal(payload);
            
    //     }
    // }
  },[ length, width, height,side,roofPitch,rodLength,roofLength,roofWidth,watchRoofModal,hCupLength,pillarLength]);

  const submitHandler = (data) => {
    
  };

  
  return (
    <>
      <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
        <Breadcrumps items={breadcrumbItems} />
      </div>
      
      <div className="rounded-lg p-5 my-2 bg-white darkCardBg">
        <form onSubmit={handleSubmit(submitHandler)} className=" w-4/5">
            <Select
              options={roofModals}
              label="Roof Modal"
              id="roof-modal"
              iconLabel={icons.homeIcon}
              placeholder="Select Roof Modal"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
          <div className="grid grid-cols-3 mt-3 gap-3">
            <FormInput
              label="Length (sqft)"
              id="length"
              iconLabel={icons.homeIcon}
              placeholder="Enter length"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
            <FormInput
              label="Width (sqft)"
              id="width"
              iconLabel={icons.homeIcon}
              placeholder="Enter "
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
            <FormInput
              label="Height (sqft)"
              id="height"
              iconLabel={icons.homeIcon}
              placeholder="Enter Height"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
            <FormInput
              label="Sides"
              id="side"
              iconLabel={icons.homeIcon}
              placeholder="Enter Side"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
            <Select
              options={roofModals}
              label="Roof Modal"
              id="roof-modal"
              iconLabel={icons.homeIcon}
              placeholder="Select Roof Modal"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
            <FormInput
              label="Roof Length"
              id="roof-length"
              iconLabel={icons.homeIcon}
              placeholder="Enter Roof Length"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
            <FormInput
              label="Roof Width"
              id="roof-width"
              iconLabel={icons.homeIcon}
              placeholder="Enter Roof Width"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />

            <Select
              options={roofPitchList}
              label="Roof Picth"
              id="roof-picth"
              iconLabel={icons.homeIcon}
              placeholder="Select Roof Pitch"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
          </div>
          <div className="mt-5">Rod Details</div>
          <div className="grid grid-cols-3 mt-3 gap-3">
          <FormInput
              label="Length (sqft)"
              id="rod-length"
              iconLabel={icons.homeIcon}
              placeholder="Enter length"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
            

          </div>
          <div className="mt-5">H Cup Details</div>

          <div className="grid grid-cols-3 mt-3 gap-3">
          <FormInput
              label="Length (sqft)"
              id="hcup-length"
              iconLabel={icons.homeIcon}
              placeholder="Enter H Cup length"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
            

          </div>
          <div className="mt-5">Bottom Piller Details</div>


          <div className="grid grid-cols-3 mt-3 gap-3">
          <FormInput
              label="Length (sqft)"
              id="pillar-length"
              iconLabel={icons.homeIcon}
              placeholder="Enter Pillar length"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
            
          </div>

          
          
        </form>

        <div className="flex  mt-7">
            Result
        </div>
      </div>
    </>
  );
}
