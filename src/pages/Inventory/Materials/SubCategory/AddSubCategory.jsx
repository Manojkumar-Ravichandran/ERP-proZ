import React, { useEffect, useState } from "react";
import Breadcrumps from "../../../../UI/Breadcrumps/Breadcrumps";
import FormCard from "../../../../UI/Card/FormCard/FormCard";
import { useForm } from "react-hook-form";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import SubmitBtn from "../../../../UI/Buttons/SubmitBtn/SubmitBtn";
import { validationPatterns } from "../../../../utils/Validation";
import { getAllCategoryListEffect } from "../../../../redux/common/CommonEffects";
import Select from "../../../../UI/Select/SingleSelect";
import {
  createMatSubCategoryInprogress,
  createMatSubCategoryInReset,
} from "../../../../redux/Inventory/Material/SubCategory/SubCategoryAction";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import Modal from "../../../../UI/Modal/Modal";
import icons from "../../../../contents/Icons";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../../UI/Buttons/Button/Button";

export default function AddSubCategory({ onSuccess }) {
  const [toastData, setToastData] = useState({ show: false });
  const [isAddCategoryModal, setIsAddCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createCategory } = useSelector((state) => state.materialSubCategory);
  const [category, setCategory] = useState([]);

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

  // Fetch categories
  useEffect(() => {
    if (category.length === 0) {
      (async () => {
        try {
          let { data } = await getAllCategoryListEffect();
          data = data.data.map((list) => ({
            label: list.category_name,
            value: list.id,
          }));
          setCategory(data);
        } catch (error) {
          setCategory([]);
        }
      })();
    }
  }, []);
  // Submit handler
  const addSubcategoryHandler = (data) => {
    setLoading(true);
    dispatch(
      createMatSubCategoryInprogress({ ...data, callback: categoryHandler })
    );
  };
 // Category handler callback
const categoryHandler = (data) => {
  setLoading(false);
  if (data?.status === "success") {
    // Show a success toast
    setToastData({
      show: true,
      message: data.message || "Operation completed successfully",
      type: "success",
    });
    dispatch(createMatSubCategoryInReset());
    setIsAddCategoryModal(false);
    onSuccess?.();
    reset()
  } else {
    setToastData({
      show: true,
      message: data.message || "Something went wrong",
      type: "error",
    });
  }
};

// Toast close handler
const toastOnclose = () => {
  setToastData(() => ({ ...toastData, show: false }));
};
  return (
    <>
      {console.log("Rendering component with state:", { toastData, isAddCategoryModal, loading, category })}
      {toastData?.show === true && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          type={toastData?.type}
          onClose={toastOnclose}
        />
      )}
      <IconButton
        icon={icons.plusIcon}
        label="Add SubCategory"
        onClick={() => {
          
          setIsAddCategoryModal(true);
        }}
      />
      <Modal
        isOpen={isAddCategoryModal}
        onClose={() => {
          
          setIsAddCategoryModal(false);
        }}
        title="Add SubCategory"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(addSubcategoryHandler)}>
          <div className="flex flex-col gap-4">
        <Select
            options={category}
            label="Category"
            iconLabel={icons.TbCategory}
            id="category_name"
            placeholder="Select Category"
            register={register}
            validation={{ required: "Category is required" }}
            errors={errors}
          />
          <FormInput
            label="Sub Category Name"
            placeholder="Enter Sub Category Name"
            register={register}
            iconLabel={icons.TbCategoryPlus}
            id="subcategory_name"
            errors={errors}
            validation={{
              required: "Sub Category name is Required",
              pattern: {
                value: validationPatterns.textwithNumberOnly,
                message: "Provide Valid Sub category",
              },
            }}
          />
         </div>
         <div className="flex gap-4 mt-4">
          <Button label={"Cancel"} className="btn_cancel" onClick={() => {setIsAddCategoryModal(false); reset()}}/>
          <IconButton label="Add SubCategory" icon={icons.plusIcon} type="submit" className="my-3" loading={loading} />
         </div>
                    

        </form>
      </Modal>
    </>
  );
}
