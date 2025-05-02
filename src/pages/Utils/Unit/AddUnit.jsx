import React, { useEffect, useState } from 'react'
import Breadcrumps from '../../../UI/Breadcrumps/Breadcrumps'
import FormInput from '../../../UI/Input/FormInput/FormInput';
import FormCard from '../../../UI/Card/FormCard/FormCard';
import { useForm } from 'react-hook-form';
import { validationPatterns } from '../../../utils/Validation';
import TextArea from '../../../UI/Input/TextArea/TextArea';
import SubmitBtn from '../../../UI/Buttons/SubmitBtn/SubmitBtn';
import { useDispatch, useSelector } from 'react-redux';
import { createUnitInprogress, createUnitInReset } from '../../../redux/Utils/Unit/UnitAction';
import AlertNotification from '../../../UI/AlertNotification/AlertNotification';
import { useNavigate } from 'react-router';
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import Modal from "../../../UI/Modal/Modal";
import icons from "../../../contents/Icons";
export default function AddUnit({ onSuccess }) {

  const {
    register,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
    handleSubmit,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createUnit } = useSelector(state => state.unitMaster);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState({ show: false });
  const [isAddModal, setIsAddModal] = useState(false);
  useEffect(() => {
    reset();
    setLoading(false)
    if (createUnit.success === true) {
      setToastData({ show: true, message: createUnit?.data.message, type: "success" });
      dispatch(createUnitInReset());
      setIsAddModal(false);
      onSuccess?.();
    } else if (createUnit.error === true) {
      setToastData({ show: true, message: createUnit?.message, type: "error" });
      dispatch(createUnitInReset());
    }
  }, [createUnit]);

  const addUnitHandler = (data) => {
    setLoading(true);
    dispatch(createUnitInprogress({ ...data, callback: categoryHandler }))

  }
  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };


  const categoryHandler = (data) => {
  };
  return (
    <>
      {toastData?.show === true && <AlertNotification
        show={toastData?.show}
        message={toastData?.message}
        type={toastData?.type}
        onClose={toastOnclose}

      />}

      <IconButton icon={icons.plusIcon} label="Add Unit" onClick={() => setIsAddModal(true)} />
      <Modal
        isOpen={isAddModal}
        onClose={() => setIsAddModal(false)}
        title="Add Units"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(addUnitHandler)}>
          <FormInput
            label="Unit"
            placeholder="Enter Unit"
            register={register}
            id="unit_name"
            iconLabel={icons.unit}
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
            iconLabel={icons.note}
            placeholder="Enter ..."
            register={register}
            id="unit_description"
            errors={errors}
            validation={{
              required: false
            }}
          />
          <IconButton label="Add Unit" icon={icons.saveIcon} type="submit" className="my-3" loading={loading} />
        </form>
      </Modal>
    </>
  )
}
