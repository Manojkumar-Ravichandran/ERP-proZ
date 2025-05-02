import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Stepper.css"; // Import the styles
import icons from "../../contents/Icons";
import Modal from "../Modal/Modal";
import TextArea from "../Input/TextArea/TextArea";
import { useForm } from "react-hook-form";
import IconButton from "../Buttons/IconButton/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { leadCloseEffect } from "../../redux/CRM/lead/LeadEffects";
import AlertNotification from "../AlertNotification/AlertNotification";
import { DetailsCall } from "../../pages/CRM/Lead/Component/LeadUtils/DetailsCall";
import { setLeadDetailInprogress } from "../../redux/CRM/lead/LeadActions";
import SearchableSelect from "../Select/SearchableSelect";
import Select from "../Select/SingleSelect";
import { getReasonListEffect } from "../../redux/common/CommonEffects";
const Stepper = ({ steps, activeStep, onStepChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [ownModalIsOpen, setOwnModalIsOpen] = useState(false);
  const [toastData, setToastData] = useState({ show: false });
  const [ownData, setOwnData] = useState(false);
  const dropdownRef = useRef(null);
  const [leadDetails, setLeadDetails] = useState()
  const leadDetail = useSelector((state) => state?.lead?.leadDetail.data);
  const [reasonList, setReasonList] = useState([]);
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
  } = useForm();
  useEffect(() => {
    setLeadDetails(leadDetail)
  }, [leadDetail])
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    // Close dropdown only if clicked outside of the dropdown button and the dropdown itself
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !event.target.closest("#dropdownDefaultButton")
    ) {
      setIsDropdownOpen(false); // Close dropdown if clicked outside
    }
  };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const handleWonLostClick = async (event, status) => {
    event.stopPropagation(); // Prevent the click from closing the dropdown
    setIsDropdownOpen(true);
    setOwnModalIsOpen(true)
    if (status == "won") {
      const payload = {
        uuid: leadDetails?.uuid,
        is_closed_type: "won"
      }
      await closeHandler(payload);
      const resetPayload = {
        uuid: leadDetails?.uuid,
        stages: ""
      }
      dispatch(setLeadDetailInprogress(resetPayload))

    } else {
      setOwnData(false);
    }
    // Open modal
  };
  const formSubmitHandler = async (data) => {
    const payload = {
      // ...data,
      uuid: leadDetails?.uuid,
      is_closed_type: "lost",
      close_reason: watch("reason")

    }
    const datas = await leadCloseEffect({ ...payload });
    closeHandler(payload)

    const resetPayload = {
      uuid: leadDetails?.uuid,
      stages: ""
    }
    dispatch(setLeadDetailInprogress(resetPayload))

  };
  const closeHandler = async (payload) => {
    try {
      const result = await leadCloseEffect(payload);
      if (result.data.status === "success") {
        setToastData({
          show: true,
          type: result?.data?.status,
          message: result?.data?.message,
        });
      }
    } catch (error) {
      console.error("Failed to create lead activity:", error);
      setToastData({
        show: true,
        type: error?.data?.status,
        message: error?.data?.message,
      });
    } finally {
      setOwnData(false);
      setIsDropdownOpen(false);
      setOwnModalIsOpen(false)
      reset(); // Reset the form after successful submission
      <DetailsCall uuid={leadDetail.uuid} />
    }
  }

  const toastOnclose = useCallback(() => {
    setToastData({ ...toastData, show: false });
  }, [toastData]);
  const stageSelect = (e) => {
    const payload = {
      uuid: leadDetail?.uuid,
      stages: e?.id
    }
    dispatch(setLeadDetailInprogress(payload))
  }


  useEffect(() => {
      (async () => {
        try {
          let { data } = await getReasonListEffect();
  
          data = data.data
          .filter((list) => list.dropdown_for === "lost_reason")
          .map((list) => ({
            ...list,
            label: list.name,
            value: list.id,
          }));
  
          setReasonList(data);
        } catch (error) {
          console.error("Error fetching reason list:", error);
          setReasonList([]);
        }
      })();
    }
  , []);
  
  return (
    <>
      {toastData?.show && (
        <AlertNotification
          type={toastData?.type}
          show={toastData?.show}
          message={toastData?.message}
          onClose={toastOnclose}
        />
      )}
      <div className="stepper-container">
        <div className="stepper">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              { (
                // <div
                //   className={`step ${index <= activeStep - 1 ? "active" : ""}`}
                // >
                <>
                  {leadDetails?.is_closed_type != 0 ? (<>
                    {
                      leadDetails?.is_closed_type === "won" &&
                      <button className={`step bg-green-500 text-white-50`} onClick={(e) => stageSelect(step)} >
                        <span >{step.label}</span>
                      </button>
                    }
                    {
                      leadDetails?.is_closed_type === "lost" &&
                      <button className={`step bg-red-700 text-white-50`} onClick={(e) => stageSelect(step)}>
                        <span >{step.label}</span>
                      </button>
                    }
                  </>) : (
                    <button
                      className={`step ${index <= activeStep - 1 ? "active text-black-900" : " bg-black-200"}`}
                      // onClick={(e) => stageSelect(step)}
                    >
                      <span >{step.label}</span>
                    </button>)}
                </>
              )}
            </React.Fragment>
          ))}
          <div
            className={`step dropdown-step  ${leadDetails?.is_closed_type === "won"
                ? "bg-green-500 text-white-50"
                : leadDetails?.is_closed_type === "lost"
                  ? "bg-red-700 text-white-50"
                  : "bg-black-200"
              }`}
            ref={dropdownRef}>
            <button
              id="dropdownDefaultButton"
              type="button"
              onClick={toggleDropdown}
              disabled={leadDetail?.is_closed === 1}
              className={`flex items-center gap-2 ${leadDetail?.is_closed === 1 ? 'cursor-not-allowed opacity-50' : ''
                }`}
            >
              <span className="flex items-center gap-2">
                Won / Lost
                {icons.arrowdown}
              </span>
            </button>

            {/* <button
              id="dropdownDefaultButton"
              type="button"
              onClick={toggleDropdown}
              disabled={leadDetail?.is_closed === 1}
            >
              <span className="flex items-center gap-2" >
                Won / Lost
                {icons.arrowdown}
              </span>
            </button> */}
          </div>

          <div
            id="dropdown"
            className={`z-10 ${isDropdownOpen ? "block" : "hidden"
              } bg-white divide-y divide-gray-100 rounded-lg shadow w-40 bg-black-200`}
          >
            <ul
              className="py-2 text-sm text-secondary-500"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <button
                  type="button"
                  className="block w-full text-secondary-500 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={(e) => {
                    handleWonLostClick(e, "won");
                  }} // Prevent dropdown from closing
                >
                  Won
                </button>
              </li>
              <li>
                <button
                  className="block w-full text-secondary-500 px-4 py-2 hover:bg-gray-100 dark:hover:text-white"
                  onClick={(e) => {
                    handleWonLostClick(e, "lost");
                  }} // Prevent dropdown from closing
                >
                  Lost
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Modal
        isOpen={ownModalIsOpen}
        onClose={() => setOwnModalIsOpen(false)}
        title="Lead Lost"
        showHeader
        size="m"
        showFooter={false}
      >
        {!ownData && (
          <>
            <form onSubmit={handleSubmit(formSubmitHandler)}>
              {/* <TextArea
                id="close_reason"
                label="Reason"
                iconLabel={icons.GoNote}
                placeholder="Enter Reason ..."
                register={register}
                validation={{
                  required: "Provide Valid Reason",
                }}
                errors={errors}
                className="col-span-8 lg:col-span-8"
              /> */}

              <SearchableSelect
                options={reasonList}
                label="Reason"
                id="close_reason"
                iconLabel={icons.GoNote}
                placeholder="Enter Product Name "
                register={register}
                validation={{
                  required: "Provide Valid Reason",
                }}
                errors={errors}
                setValue={setValue}
                onChange={(selected) => setValue("reason", selected?.label)} 
              />
              <IconButton type="submit" icon={icons.lost} label="Submit" />
            </form>
          </>
        )}
      </Modal>
    </>
  );
};

export default Stepper;
