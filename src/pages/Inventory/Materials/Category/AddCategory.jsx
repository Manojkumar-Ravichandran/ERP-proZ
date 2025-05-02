import React, { useEffect, useState } from "react";
import Breadcrumps from "../../../../UI/Breadcrumps/Breadcrumps";
import { H5 } from "../../../../UI/Heading/Heading";
import FormCard from "../../../../UI/Card/FormCard/FormCard";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import { useForm } from "react-hook-form";
import SubmitBtn from "../../../../UI/Buttons/SubmitBtn/SubmitBtn";
import { validationPatterns } from "../../../../utils/Validation";
import { useDispatch, useSelector } from "react-redux";
import { createMatCategoryInprogress, createMatCategoryInReset } from "../../../../redux/Inventory/Material/Category/CategoryAction";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import { useNavigate } from "react-router";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import Modal from "../../../../UI/Modal/Modal";
import icons from "../../../../contents/Icons";
export default function AddCategory({onSuccess}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createCategory } = useSelector((state) => state.materialCategory);
  const [toastData, setToastData] = useState({ show: false });
  const [isAddCategoryModal, setIsAddCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
    handleSubmit,
  } = useForm();

  useEffect(() => {
    reset();
    setLoading(false)
    if (createCategory.success === true) {
      setToastData({ show: true, message: createCategory?.data.message, type: "success" });
      dispatch(createMatCategoryInReset());
      setIsAddCategoryModal(false);
      onSuccess?.(); 
    } else if (createCategory.error === true) {
      setToastData({ show: true, message: createCategory?.message, type: "error" });
      dispatch(createMatCategoryInReset());
    }
  }, [createCategory]);

  const addCategoryHanlder = (data) => {
    setLoading(true);
    dispatch(
      createMatCategoryInprogress({ ...data, callback: categoryHandler })
    );
  };
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
      <IconButton icon={icons.plusIcon} label="Add Category" onClick={() => setIsAddCategoryModal(true)} />
      <Modal
        isOpen={isAddCategoryModal}
        onClose={() => setIsAddCategoryModal(false)}
        title="Add Category"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(addCategoryHanlder)}>
          <FormInput
            label="Category Name"
            placeholder="Enter Category Name"
            register={register}
            id="category_name"
            errors={errors}
            iconLabel={icons.TbCategory}
            validation={{
              required: "Category name is Required",
              pattern: {
                value: validationPatterns.textwithNumberOnly,
                message: "Provide Valid Name",
              },
            }}
          />
                    <IconButton label="Add Category" icon={icons.saveIcon} type="submit" className="my-3" loading={loading} />
        </form>
      </Modal>
    </>
  );
}
