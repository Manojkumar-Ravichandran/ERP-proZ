import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import icons from "../../../contents/Icons";
import AlertNotification from "../../../UI/AlertNotification/AlertNotification";
import { useDispatch, useSelector } from "react-redux";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import Select from "../../../UI/Select/SingleSelect";
import FileInput from "../../../UI/Input/FileInput/FileInput";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import formatDateForInput from "../../../UI/Date/Date";
import { createReason } from "../../../redux/Utils/Reason/ReasonAction";
import Modal from "../../../UI/Modal/Modal";
import TextArea from "../../../UI/Input/TextArea/TextArea";

const CreateReasons = ({ onSuccess }) => {
    const dispatch = useDispatch();
    const { register, formState: { errors }, handleSubmit, reset } = useForm();
    const [toastData, setToastData] = useState({ show: false });
    const [loading, setLoading] = useState(false);
    const [isAddAssetsModal, setIsAddAssetsModal] = useState(false);
    const [queryList, setQueryList] = useState([{ id: Date.now(), question: "", answer: "" }]);

    // const handleAddQuery = () => {
    //     setQueryList([...queryList, { id: Date.now(), question: "", answer: "" }]);
    // };

    // const handleRemoveQuery = (id) => {
    //     setQueryList(queryList.filter(query => query.id !== id));
    // };
    const addMasterHandler = (data) => {
        // const answers = queryList.map((query) => ({
        //     ans: data[`answer_${query.id}`],
        // }));
        const payload = {
            name: data.query_name,
            dropdown_for: data.dropdown_for,
        };

        setLoading(true);
        dispatch(
            createReason({
                ...payload,
                callback: masterHandler,
            })
        );
    };

    const masterHandler = (response) => {
        if (response.success) {
            setToastData({ show: true, message: response.data.message, type: "success" });
            setIsAddAssetsModal(false);
            onSuccess?.();
            reset();
        } else {
            setToastData({ show: true, message: response.error, type: "error" });
        }
        setLoading(false);
    };

    const openModalHandler = () => {
        setIsAddAssetsModal(true);
    };
    const reasonType = [
        { label: "Reopen Reason", value: "reopen_reason" },
        { label: "Lost Reason", value: "lost_reason" },
        { label: "Reallocate Reason", value: "reallocate_reason" },
    ];
    return (
        <>
            {toastData.show && (
                <AlertNotification
                    type={toastData.type}
                    show={toastData.show}
                    message={toastData.message}
                    onClose={() => setToastData({ ...toastData, show: false })}
                />
            )}
            <IconButton label="Add Reason" icon={icons.plusIcon} onClick={openModalHandler} />
            <Modal
                isOpen={isAddAssetsModal}
                onClose={() => setIsAddAssetsModal(false)}
                title="Add Reason"
                showHeader
                size="m"
                showFooter={false}
                className="darkCardBg"
            >
                <form onSubmit={handleSubmit(addMasterHandler)}>
                    <Select
                        options={reasonType}
                        label="Reason Type"
                        id="dropdown_for"
                        iconLabel={icons.itemBox}
                        placeholder="Select Reason Type"
                        register={register}
                        errors={errors}
                    />
                    <TextArea
                        id="query_name"
                        iconLabel={icons.enquiry}
                        label={"Reason"}
                        validation={{ required: "Question is required" }}
                        register={register}
                        errors={errors}
                    />
                    {/* {queryList.map((query, index) => (
                        <div key={query.id} className="query-row mb-3">
                            {queryList.length > 1 && (
                                <button
                                    onClick={() => handleRemoveQuery(query.id)}
                                    className="ml-3 float-end text-red-600">{icons.deleteIcon}
                                </button>
                            )}
                            <TextArea
                                id={`answer_${query.id}`}
                                iconLabel={icons.answerIcon}
                                label={`Answer ${index + 1}`}
                                validation={{ required: "Answer is required" }}
                                register={register}
                                errors={errors}
                            />

                        </div>
                    ))} */}
                    {/* <IconButton label="Add Answer" icon={icons.plusIcon} type="button" onClick={handleAddQuery} /> */}
                    <div className="flex mt-4 gap-3">
                        <IconButton
                            type="button"
                            icon={React.cloneElement(icons.cancelIcon, { size: "20px" })}
                            label="Cancel"
                            onClick={() => setIsAddAssetsModal(false)}
                            className="px-4 py-2 btn_cancel"
                        />
                        <IconButton label="Save" icon={icons.saveIcon} type="submit" loading={loading} />
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default CreateReasons;
