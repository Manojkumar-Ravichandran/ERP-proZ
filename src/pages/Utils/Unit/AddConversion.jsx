// import React, { useEffect, useState } from 'react'
// import FormInput from '../../../UI/Input/FormInput/FormInput';
// import { useForm } from 'react-hook-form';
// import { useDispatch, useSelector } from 'react-redux';
// import { createUnitConversionInprogress, createUnitConversionInReset } from '../../../redux/Utils/Unit/UnitAction';
// import AlertNotification from '../../../UI/AlertNotification/AlertNotification';
// import { useNavigate } from 'react-router';
// import IconButton from "../../../UI/Buttons/IconButton/IconButton";
// import Modal from "../../../UI/Modal/Modal";
// import icons from "../../../contents/Icons";
// import { getAllUnitListEffect } from "../../../redux/common/CommonEffects";
// import Select from "../../../UI/Select/SingleSelect";

// export default function AddConversion({ onSuccess }) {

//     const { register, formState: { errors }, control, setValue, reset, watch, handleSubmit } = useForm();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { createUnitConversion } = useSelector(state => state. );
//     const [loading, setLoading] = useState(false);
//     const [toastData, setToastData] = useState({ show: false });
//     const [isAddModal, setIsAddModal] = useState(false);
//     const [unitLists, setUnitLists] = useState([]);
//     const [unitListsData, setunitListsData] = useState([]);
   
  
//     useEffect(() => {
//         if (unitLists.length === 0) {
//             (async () => {
//                 try {
//                     let { data } = await getAllUnitListEffect();
//                     data = data.data.map((list) => ({
//                         label: `1 ${list.unit_description} (${list.unit_name})`,
//                         value: list.id,
//                     }));
//                     setUnitLists(data);
//                 } catch (error) {
//                     setUnitLists([]);
//                 }
//             })();
//         }
//     }, [unitLists]);
//     // ///////////////////////
//     useEffect(() => {
//         if (unitListsData.length === 0) {
//             (async () => {
//                 try {
//                     let { data } = await getAllUnitListEffect();
//                     data = data.data.map((list) => ({
//                         label: list.unit_name,
//                         value: list.id,
//                     }));
//                     setunitListsData(data);
//                 } catch (error) {
//                     setunitListsData([]);
//                 }
//             })();
//         }
//     }, [unitListsData]);
//      useEffect(() => {
//         reset();
//         setLoading(false)
//         if (createUnitConversion.success === true) {
//           setToastData({ show: true, message: createUnitConversion?.data.message, type: "success" });
//           dispatch(createUnitConversionInReset());
//           setIsAddModal(false);
//           onSuccess?.(); 
//         } else if (createUnitConversion.error === true) {
//           setToastData({ show: true, message: createUnitConversion?.message, type: "error" });
//           dispatch(createUnitConversionInReset());
//         }
//       }, [createUnitConversion]);
//     const categoryHandler = (data) => {
//     };

//     const addUnitHandler = (data) => {
//         const selectedUnit = unitListsData.find(unit => unit.value === parseInt(data.conversion_id));
//         const updatedData = {
//             ...data,
//             conversion: selectedUnit ? selectedUnit.label : "",
//         };

//         setLoading(true);
//         dispatch(createUnitConversionInprogress({ ...updatedData, callback: categoryHandler }));
//     };

//     const toastOnclose = () => {
//         setToastData(() => ({ ...toastData, show: false }));
//     };

//     return (
//         <>
//             {toastData?.show === true && <AlertNotification
//                 show={toastData?.show}
//                 message={toastData?.message}
//                 type={toastData?.type}
//                 onClose={toastOnclose}

//             />}

//             <IconButton icon={icons.plusIcon} label="Add Conversion" onClick={() => setIsAddModal(true)} />
//             <Modal
//                 isOpen={isAddModal}
//                 onClose={() => setIsAddModal(false)}
//                 title="Add Conversion"
//                 showHeader
//                 size="m"
//                 showFooter={false}
//             >
//                 <form onSubmit={handleSubmit(addUnitHandler)}>
//                     <Select
//                         options={unitLists}
//                         label="Unit"
//                         id="unit_id"
//                         iconLabel={icons.unitIcon}
//                         placeholder="Select Unit"
//                         register={register}
//                         validation={{ required: "Unit is Required" }}
//                         errors={errors}
//                     />
//                     <FormInput
//                         label="Rate"
//                         id="rate"
//                         type="number"
//                         iconLabel={icons.moneyIcon}
//                         placeholder="Enter Rate"
//                         register={register}
//                         validation={{
//                             required: "Rate is required",
//                         }}
//                         errors={errors}
//                     />
//                     <Select
//                         options={unitListsData}
//                         label="Unit"
//                         id="conversion_id"
//                         iconLabel={icons.unitIcon}
//                         placeholder="Select Unit"
//                         register={register}
//                         validation={{ required: "Unit is Required" }}
//                         errors={errors}
//                     />
//                     <IconButton
//                         label="Save"
//                         icon={icons.saveIcon}
//                         type="submit"
//                         className={`my-3 ${loading ? "btn-disabled" : ""}`}
//                         loading={loading}
//                     />
//                 </form>
//             </Modal>
//         </>
//     )
// }


import React, { useEffect, useState } from 'react';
import FormInput from '../../../UI/Input/FormInput/FormInput';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createUnitConversionInprogress, createUnitConversionInReset } from '../../../redux/Utils/Unit/UnitAction';
import AlertNotification from '../../../UI/AlertNotification/AlertNotification';
import { useNavigate } from 'react-router';
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import Modal from "../../../UI/Modal/Modal";
import icons from "../../../contents/Icons";
import { getAllUnitListEffect } from "../../../redux/common/CommonEffects";
import Select from "../../../UI/Select/SingleSelect";

export default function AddConversion({ onSuccess }) {

    const { register, formState: { errors }, control, setValue, reset, watch, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { createUnitConversion } = useSelector(state => state.unitMaster); // Access the correct state from Redux
    const [loading, setLoading] = useState(false);
    const [toastData, setToastData] = useState({ show: false });
    const [isAddModal, setIsAddModal] = useState(false);
    const [unitLists, setUnitLists] = useState([]);
    const [unitListsData, setunitListsData] = useState([]);

    // Fetch unit lists when the component mounts
    useEffect(() => {
        const fetchUnitLists = async () => {
            try {
                let { data } = await getAllUnitListEffect();
                const formattedData = data.data.map(list => ({
                    label: `1 ${list.unit_description} (${list.unit_name})`,
                    value: list.id,
                }));
                setUnitLists(formattedData);
            } catch (error) {
                console.error("Failed to fetch unit lists:", error);
                setUnitLists([]);
            }
        };

        if (unitLists.length === 0) {
            fetchUnitLists();
        }
    }, [unitLists]);

    useEffect(() => {
        const fetchUnitListsData = async () => {
            try {
                let { data } = await getAllUnitListEffect();
                const formattedData = data.data.map(list => ({
                    label: list.unit_name,
                    value: list.id,
                }));
                setunitListsData(formattedData);
            } catch (error) {
                console.error("Failed to fetch unit lists data:", error);
                setunitListsData([]);
            }
        };

        if (unitListsData.length === 0) {
            fetchUnitListsData();
        }
    }, [unitListsData]);

    // Handle successful or error responses
    useEffect(() => {
        if (createUnitConversion.success) {
            setToastData({ show: true, message: createUnitConversion?.data?.message, type: "success" });
            dispatch(createUnitConversionInReset());
            setIsAddModal(false);
            onSuccess?.(); // Call onSuccess if provided
        } else if (createUnitConversion.error) {
            setToastData({ show: true, message: createUnitConversion?.message, type: "error" });
            dispatch(createUnitConversionInReset());
        }
        setLoading(false); // Reset loading when action completes
    }, [createUnitConversion, dispatch, onSuccess]);

    // Handle form submission
    const addUnitHandler = (data) => {
        const selectedUnit = unitListsData.find(unit => unit.value === parseInt(data.conversion_id));
        const updatedData = {
            ...data,
            conversion: selectedUnit ? selectedUnit.label : "",
        };

        setLoading(true);
        dispatch(createUnitConversionInprogress({ ...updatedData, callback: categoryHandler }));
    };

    // Handle category callback (if needed for further processing)
    const categoryHandler = (data) => {
        // Additional logic if needed after category handling
    };

    // Close toast notification
    const toastOnclose = () => {
        setToastData({ ...toastData, show: false });
    };

    return (
        <>
            {toastData.show && (
                <AlertNotification
                    show={toastData.show}
                    message={toastData.message}
                    type={toastData.type}
                    onClose={toastOnclose}
                />
            )}

            <IconButton icon={icons.plusIcon} label="Add Conversion" onClick={() => setIsAddModal(true)} />
            
            <Modal
                isOpen={isAddModal}
                onClose={() => setIsAddModal(false)}
                title="Add Conversion"
                showHeader
                size="m"
                showFooter={false}
            >
                <form onSubmit={handleSubmit(addUnitHandler)}>
                    <Select
                        options={unitLists}
                        label="Unit"
                        id="unit_id"
                        iconLabel={icons.unitIcon}
                        placeholder="Select Unit"
                        register={register}
                        validation={{ required: "Unit is Required" }}
                        errors={errors}
                    />
                    <FormInput
                        label="Rate"
                        id="rate"
                        type="number"
                        iconLabel={icons.moneyIcon}
                        placeholder="Enter Rate"
                        register={register}
                        validation={{ required: "Rate is required" }}
                        errors={errors}
                    />
                    <Select
                        options={unitListsData}
                        label="Unit"
                        id="conversion_id"
                        iconLabel={icons.unitIcon}
                        placeholder="Select Unit"
                        register={register}
                        validation={{ required: "Unit is Required" }}
                        errors={errors}
                    />
                    <IconButton
                        label="Save"
                        icon={icons.saveIcon}
                        type="submit"
                        className={`my-3 ${loading ? "btn-disabled" : ""}`}
                        loading={loading}
                    />
                </form>
            </Modal>
        </>
    );
}
