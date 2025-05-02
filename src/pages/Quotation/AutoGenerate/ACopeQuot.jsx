import React, { useEffect, useState } from "react";
import Breadcrumps from "../../../UI/Breadcrumps/Breadcrumps";
import { useForm } from "react-hook-form";
import icons from "../../../contents/Icons";
import Select from "../../../UI/Select/SingleSelect";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { pichList, roofModal } from "../../../contents/Qutoation/RoofData";
import { ACopeCal } from "../../../utils/QuotationCalculation/ACope";
import SearchableSelWimg from "../../../UI/Select/SearchableSelWimg";
import SearchableSelect from "../../../UI/Select/SearchableSel";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({});
  const [formInput, setFormInput] = useState({});
  const [materialCostData, setMaterialCostData] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
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
    setValue("roof-name", "Polycarbonate ");
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

    
    //     }
    // }
  }, [
    length,
    width,
    height,
    side,
    roofPitch,
    rodLength,
    roofLength,
    roofWidth,
    watchRoofModal,
    hCupLength,
    pillarLength,
  ]);
  const calculateHandler = () => {
    const payload = {
      length,
      width,
      height,
      side,
      roofModal: watchRoofModal,
      roofLength,
      roofWidth,
      roofPitch,
      rodLength,
      hCupLength,
      pillarLength,
    };
    setFormInput(payload);
    const results = ACopeCal(payload);
    setIsSubmit(true);
    return results;
  };

  const submitHandler = (data) => {
    const results = calculateHandler();
    
    setResult(results);
    MaterialAmountCal(results);
  };
  const MaterialAmountCal = (data) => {
    const payload = [
      {
        id: 1,
        name:`Polycarbonate Sheets (${formInput?.length}x${formInput?.width}, 10mm)`,
        quantity: data?.totalSheet,
        unit: "Nos",
        price: 1500,
        total: data?.totalSheet * 1500,
      },
      {
        id:2,
        name: "Rod (per ft)",
        quantity: data?.totalRodCount,
        unit: "Nos",
        price: 120,
        total: data?.totalRodCount * 120,

      },
      {
        id:3,
        name: "Screw and Washer (per piece)",
        quantity: data?.screwCount,
        unit: "Nos",
        price: 15,
        total: data?.screwCount * 15,
      },
      {
        id:4,
        name: "H Joiner (per piece)",
        quantity: data?.HJoinerCount,
        unit: "Nos",
        price: 10,
        total: data?.HJoinerCount * 10,
      },
      {
        id:5,
        name: "Anti Dust Tap Roll",
        quantity: data?.antiDustTapCount,
        unit: "Nos",
        price: 100,
        total: data?.antiDustTapCount * 100,
      },
      {
        id:6,
        name: "Sealing Tap Roll",
        quantity: data?.sealingTapeCount,
        unit: "Nos",
        price: 50,
        total: data?.sealingTapeCount * 50,
      },
      {
        id:7,
        name: "Pillar",
        quantity: data?.totalPillarCount,
        unit: "Nos",
        price: 500,
        total: data?.totalPillarCount * 500,
      },

    ];
    setMaterialCostData(payload);

  }
  const toINRF = (value) => {
    return new Intl.NumberFormat("en-IN", { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(value);  
  }
  const totalAmount = materialCostData.reduce((acc, item) => acc + item.total, 0);
  return (
    <>
      <div className="rounded-lg p-2 my-2 bg-white darkCardBg">
        <Breadcrumps items={breadcrumbItems} />
      </div>

      <div className="rounded-lg p-5 my-2 bg-white darkCardBg">
        <form onSubmit={handleSubmit(submitHandler)} className=" w-4/5">
          <div className="grid grid-cols-2 gap-3">
            <SearchableSelect
              options={roofModals}
              label="Roof Modal"
              id="roof-modal"
              iconLabel={icons.homeIcon}
              placeholder="Select Roof Modal"
              register={register}
              showStar={true}
              validation={{ required: "Required Roof Modal" }}
              errors={errors}
              setValue={setValue}
            />
            <>
              {watchRoofModal == 1 && (
                <img src={roofModals[0]?.img} alt="roof" />
              )}
              {watchRoofModal == 2 && (
                <img src={roofModals[1]?.img} alt="roof" />
              )}
            </>
          </div>
          <div className="mt-3 text-xl top-clr font-semibold">Area Details</div>

          <div className="grid grid-cols-3 mt-3 gap-5">
            <FormInput
              label="Length (ft)"
              id="length"
              iconLabel={React.cloneElement(icons.lengthScaleIcon, {
                size: 20,
              })}
              placeholder="Enter length"
              register={register}
              showStar={true}
              validation={{ required: "Provide Length" }}
              errors={errors}
            />
            <FormInput
              label="Width (ft)"
              id="width"
              iconLabel={React.cloneElement(icons.widthScaleIcon, { size: 20 })}
              placeholder="Enter Width"
              register={register}
              showStar={true}
              validation={{ required: "Provide Width" }}
              errors={errors}
            />
            <FormInput
              label="Height (ft)"
              id="height"
              iconLabel={React.cloneElement(icons.heightScaleIcon, {
                size: 20,
              })}
              placeholder="Enter Height"
              register={register}
              showStar={true}
              validation={{ required: "Provide Height" }}
              errors={errors}
            />
            <FormInput
              label="Sides"
              id="side"
              iconLabel={React.cloneElement(icons.sides, { size: 20 })}
              placeholder="Enter Side"
              register={register}
              showStar={true}
              validation={{ required: "Provide Side" }}
              errors={errors}
            />
            <Select
              options={roofPitchList}
              label="Roof Picth"
              id="roof-picth"
              placeholder="Select Roof Pitch"
              register={register}
              showStar={true}
              validation={{ required: "Provide Roof Pitch" }}
              errors={errors}
            />
            {/* <Select
              options={roofModals}
              label="Roof Modal"
              id="roof-modal"
              iconLabel={icons.homeIcon}
              placeholder="Select Roof Modal"
              register={register}
              showStar={true}
              validation={{ required: false }}
              errors={errors}
            /> */}
          </div>
          <div className="mt-5 text-lg top-clr font-semibold">Roof Details</div>
          <div className="grid grid-cols-3 mt-3 gap-3">
            <FormInput
              label="Roof Name"
              id="roof-name"
              iconLabel={icons.homeIcon}
              placeholder="Enter Roof Name"
              register={register}
              showStar={true}
              validation={{ required: "Provide Roof Name" }}
              errors={errors}
              disabled={true}
            />
            <FormInput
              label="Roof Length"
              id="roof-length"
              iconLabel={icons.homeIcon}
              placeholder="Enter Roof Length"
              register={register}
              showStar={true}
              validation={{ required: "Provide Roof Length" }}
              errors={errors}
            />
            <FormInput
              label="Roof Width"
              id="roof-width"
              iconLabel={icons.homeIcon}
              placeholder="Enter Roof Width"
              register={register}
              showStar={true}
              validation={{ required: "Provide Roof Width" }}
              errors={errors}
            />
          </div>
          <div className="mt-5 text-lg top-clr font-semibold">Rod Details</div>
          <div className="grid grid-cols-3 mt-3 gap-3">
            <FormInput
              label="Rod Length (ft)"
              id="rod-length"
              placeholder="Enter length"
              register={register}
              showStar={true}
              validation={{ required: "Provide Rod Length" }}
              errors={errors}
            />
          </div>
          <div className="mt-5 text-lg top-clr font-semibold">
            H Cup Details
          </div>

          <div className="grid grid-cols-3 mt-3 gap-3">
            <FormInput
              label="Cup Length (ft)"
              id="hcup-length"
              iconLabel={icons.homeIcon}
              placeholder="Enter H Cup length"
              register={register}
              showStar={true}
              validation={{ required: "Provide H Cup Length" }}
              errors={errors}
            />
          </div>
          <div className="mt-5 text-lg top-clr font-semibold">
            Bottom Piller Details
          </div>

          <div className="grid grid-cols-3 mt-3 gap-3">
            <FormInput
              label="Pillar Length (ft)"
              id="pillar-length"
              iconLabel={icons.homeIcon}
              placeholder="Enter Pillar length"
              register={register}
              showStar={true}
              validation={{ required: "Provide Piller Length" }}
              errors={errors}
            />
          </div>

          <div className="mt-5">
            <IconButton
              type="submit"
              icon={React.cloneElement(icons?.calculator, { size: "20px" })}
              label="Calculate"
              className="px-4 py-2"
              loading={loading}
            />
          </div>
        </form>
       {isSubmit&& <>
        <div>
          <div>
            <span className="text-secondary-500 font-semibold pe-3">
              Roof Modal Name:{" "}
            </span>
            <span>{roofModals[watchRoofModal - 1]?.label}</span>
          </div>
          <div className="top-clr font-semibold text-lg mt-3">Land Details</div>
          <div className="flex gap-5">
            <div>
              <span className="text-secondary-500 font-semibold pe-2">
                Land length :
              </span>
              <span>{length} feet</span>
            </div>
            <div>
              <span className="text-secondary-500 font-semibold pe-2">
                Land Width :
              </span>
              <span>{width} feet</span>
            </div>
            <div>
              <span className="text-secondary-500 font-semibold pe-2">
                Land Height :
              </span>
              <span>{height} feet</span>
            </div>
            <div>
              <span className="text-secondary-500 font-semibold pe-2">
                Land Area :
              </span>
              <span>{result?.bottomBaseArea} feet</span>
            </div>
          </div>

          <div className="top-clr font-semibold text-lg mt-3">
            Material Details
          </div>
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-secondary-500 font-semibold pe-2">
                Roof Count :
              </span>
              <span>{result?.totalSheet} Nos</span>
            </div>
            <div>
              <span className="text-secondary-500 font-semibold pe-2">
                Total Rod Count :
              </span>
              <span>{result?.totalRodCount} Nos</span>
            </div>
            <div>
              <span className="text-secondary-500 font-semibold pe-2">
                Total Screw and Washer Count :
              </span>
              <span>{result?.screwCount} Nos</span>
            </div>
            <div>
              <span className="text-secondary-500 font-semibold pe-2">
                Total H Join Count :
              </span>
              <span>{result?.HJoinerCount} Nos</span>
            </div>
            <div>
              <span className="text-secondary-500 font-semibold pe-2">
                Total Anti Dust Tap Roll Count :
              </span>
              <span>{result?.antiDustTapCount} Nos</span>
            </div>
            <div>
              <span className="text-secondary-500 font-semibold pe-2">
                Total Sealing Tap Roll Count :
              </span>
              <span>{result?.sealingTapeCount} Nos</span>
            </div>
            <div>
              <span className="text-secondary-500 font-semibold pe-2">
                Total Pillar Count :
              </span>
              <span>{result?.totalPillarCount} Nos</span>
            </div>
          </div>
        </div>
        <div>
          <div className="top-clr font-semibold text-lg mt-3">Material Amount</div>
          <table className="table-auto  border-collapse w-1/2 mt-3">
            <thead className="bg-secondary-50">
              <th className="border p-2">Item</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Unit Price (Rs.)</th>
              <th className="border p-2">Total Price (Rs.)</th>
            </thead>
            <tbody>
              {materialCostData.map((item) => (
                <tr key={item.id} className="border">
                  <td className="border p-2 text-center">{item.name}</td>
                  <td className="border p-2 text-center">{item.quantity}</td>
                  <td className="border p-2 text-end">{toINRF(item.price)}</td>
                  <td className="border p-2 text-end">{toINRF(item.total)}</td>
                </tr>
              ))}
              <tr  className="border">
                <td className="border p-2 text-end" colspan={3}>Total</td>
                <td className="border p-2 text-end">Rs.{toINRF(totalAmount)}</td>

              </tr>
            </tbody>
          </table>
        </div>
        </>}
      </div>
    </>
  );
}
