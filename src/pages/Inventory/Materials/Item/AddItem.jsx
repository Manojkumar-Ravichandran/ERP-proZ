import React, { useEffect, useState } from "react";
import Breadcrumps from "../../../../UI/Breadcrumps/Breadcrumps";
import FormCard from "../../../../UI/Card/FormCard/FormCard";
import { useForm } from "react-hook-form";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import Select from "../../../../UI/Select/SingleSelect";
import { validationPatterns } from "../../../../utils/Validation";
import SubmitBtn from "../../../../UI/Buttons/SubmitBtn/SubmitBtn";
import {
  getAllCategoryListEffect,
  getAllSubCategoryListEffect,
  getAllUnitListEffect,
  addRefernceEffect,
} from "../../../../redux/common/CommonEffects";
import { useDispatch, useSelector } from "react-redux";
import {
  createMatItemInprogress,
  createMatItemInReset,
} from "../../../../redux/Inventory/Material/Item/ItemAction";
import { useNavigate } from "react-router";
import AlertNotification from "../../../../UI/AlertNotification/AlertNotification";
import IconButton from "../../../../UI/Buttons/IconButton/IconButton";
import Modal from "../../../../UI/Modal/Modal";
import icons from "../../../../contents/Icons";
import Button from "../../../../UI/Buttons/Button/Button";
import SingleCheckbox from "../../../../UI/Input/CheckBoxInput/SingleCheckbox";

export default function AddItem({ onSuccess }) {
  const {
    register,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
    handleSubmit,
  } = useForm({
    defaultValues: {
      category_id: null,
      subcategory_id: null,
      unit: null,
    },
  });
  const [loading, setLoading] = useState();
  const [toastData, setToastData] = useState({ show: false });
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [inventoryList, setinventoryList] = useState([]);
  const categoryName = watch("category_id");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createItem } = useSelector((state) => state.materialItem);
  const [isAddCategoryModal, setIsAddCategoryModal] = useState(false);

  useEffect(() => {
      (async () => {
        try {
          let { data } = await getAllCategoryListEffect();
          data = data.data.map((list) => ({
            label: list.category_name,
            value: list.id,
          }));
          setCategoryList(data);
        } catch (error) {
          setCategoryList([]);
        }
      })();
    setValue("category_id", "");
  }, []);
  useEffect(() => {
      (async () => {
        try {
          let { data } = await getAllUnitListEffect();
          data = data.data.map((list) => ({
            label: list.unit_name,
            value: list.id,
          }));
          setUnitList(data);
        } catch (error) {
          setUnitList([]);
        }
      })();
  }, []);

  useEffect(() => {
    reset();
    setLoading(false);
    if (createItem.success === true) {
      setToastData({
        show: true,
        message: createItem?.data.message,
        type: "success",
      });
      dispatch(createMatItemInReset());
      setIsAddCategoryModal(false);
      onSuccess?.();
    } else if (createItem.error === true) {
      setToastData({ show: true, message: createItem?.message, type: "error" });
      dispatch(createMatItemInReset());
    }
  }, [createItem]);

  useEffect(() => {
    if (categoryName) {
      getSubCategoryList(categoryName);
    }
  }, [categoryName]);

  const getSubCategoryList = async (category_id) => {
    const payload = {
      category_id,
    };
    let data = await getAllSubCategoryListEffect(payload);
    if (data?.data?.data?.length > 0) {
      data = data.data.data.map((list) => ({
        label: list.subcategory_name,
        value: list.id,
      }));
    } else {
      data = [];
    }
    setSubcategoryList(data);
  };
  const addItemHandler = (data) => {
    const payload = {
      ...data,
      category_id: data?.category_id || null,
    };
    dispatch(createMatItemInprogress({ ...payload }));
  };
  const toastOnclose = () => {
    setToastData(() => ({ ...toastData, show: false }));
  };
  return (
    <>
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
        label="Create Item"
        onClick={() => {
          setIsAddCategoryModal(true);
          reset();
        }}
      />
      <Modal
        isOpen={isAddCategoryModal}
        onClose={() => setIsAddCategoryModal(false)}
        title="Create Item"
        showHeader
        size="m"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(addItemHandler)}>
          <div className="flex flex-col gap-4">
            <Select
              options={categoryList}
              label="Category"
              id="category_id"
              placeholder="Select Category"
              iconLabel={icons.TbCategory}
              register={register}
              validation={{ required: "catagory Required" }}
              errors={errors}
            />
            <Select
              options={subcategoryList}
              label="Sub Category"
              iconLabel={icons.TbCategoryPlus}
              id="subcategory_id"
              placeholder="Select Sub Category"
              register={register}
              showStar={false}
              validation={{ required: false }}
              errors={errors}
            />
            <FormInput
              label="Item name"
              placeholder="Enter Item Name"
              iconLabel={icons.itemBox}
              register={register}
              id="material_name"
              errors={errors}
              validation={{
                required: "Item name is Required",
                pattern: {
                  value: validationPatterns.textwithNumberOnly,
                  message: "Provide Valid Item ",
                },
              }}
            />
            <Select
              options={unitList}
              label="Unit"
              id="unit"
              iconLabel={icons.unit}
              placeholder="Select Unit"
              register={register}
              validation={{ required: "Unit is Required" }}
              errors={errors}
            />
            <FormInput
              label="Variant"
              placeholder="Enter Variant"
              iconLabel={icons.itemBox}
              register={register}
              id="variant"
              errors={errors}
              validation={{
                required: "Variant is Required",
                pattern: {
                  value: validationPatterns.textwithNumberOnly,
                  message: "Provide Valid Item ",
                },
              }}
            />
            <FormInput
              label="Colour"
              placeholder="Enter Colour"
              iconLabel={icons.itemBox}
              register={register}
              id="color"
              errors={errors}
              validation={{
                required: "Colour is Required",
                pattern: {
                  value: validationPatterns.textwithNumberOnly,
                  message: "Provide Valid Item ",
                },
              }}
            />
            <FormInput
              label="HSN Code"
              placeholder="Enter HSN Code"
              iconLabel={icons.circleCheck}
              register={register}
              id="hsn_code"
              errors={errors}
              validation={{
                required: "HSN Code is Required",
                minLength: {
                  value: 4,
                  message: "HSN Code must be at least 4 characters",
                },
                maxLength: {
                  value: 8,
                  message: "HSN Code must be no more than 8 characters",
                },
                pattern: {
                  value: validationPatterns.hsnCode,
                  message: "Provide Valid HSN Code ",
                },
              }}
            />

            <FormInput
              label="GST"
              showStar={true}
              placeholder="Enter GST %"
              iconLabel={icons.money}
              register={register}
              id="gst_percentage"
              errors={errors}
              validation={{
                required: "GST is Required",
                pattern: {
                  value: validationPatterns.percentage,
                  message: "Provide Valid GST ",
                },
              }}
              // validation={{
              //   required: "GST is Required",
              //   minLength: {
              //     value: 1,
              //     message: "GST at least should have 1 character",
              //   },
              //   maxLength: {
              //     value: 3,
              //     message: "GST must be no more than 3 characters",
              //   },
              //   min: {
              //     value: 1,
              //     message: "GST must be at least 1",
              //   },
              //   max: {
              //     value: 100,
              //     message: "GST must not exceed 100",
              //   },
              //   pattern: {
              //     value: validationPatterns.spacePattern,
              //     message: "Provide Valid GST ",
              //   },
              // }}
            />
            <FormInput
              label="Item code"
              placeholder="Enter Item Code"
              register={register}
              iconLabel={icons.itemCode}
              id="material_code"
              errors={errors}
              showStar={false}
              validation={{
                required: false,
              }}
            />

            <FormInput
              label="Purchase Rate"
              placeholder="Buying Rate Rs."
              iconLabel={icons.moneyIcon}
              register={register}
              type="number"
              id="comp_cost"
              errors={errors}
              validation={{
                required: "Company rate is Required",
                minLength: {
                  value: 1,
                  message: "Rate at least should have 1 rupees",
                },
                min: {
                  value: 1,
                  message: "Rate must be at least 1",
                },
                pattern: {
                  value: validationPatterns.numberOnly,
                  message: "Provide Valid Rupees",
                },
              }}
            />
            <FormInput
              label="Sales Rate"
              type="number"

              placeholder="Customer Rate Rs."
              register={register}
              id="cust_cost"
              iconLabel={icons.moneyIcon}
              errors={errors}
              validation={{
                required: "Customer rate is Required",
                minLength: {
                  value: 1,
                  message: "Rate at least should have 1 rupees",
                },
                min: {
                  value: 1,
                  message: "Rate must be at least 1",
                },
                pattern: {
                  value: validationPatterns.numberOnly,
                  message: "Provide Valid Rupees",
                },
              }}
            />
             <SingleCheckbox
                id="is_asset"
                label="Mark as Asset"
                register={register}
                errors={errors}
                validation={{
                  required: false,
                }}
              />
             <SingleCheckbox
                id="is_traceability"
                label="Enable Traceability"
                register={register}
                errors={errors}
                validation={{
                  required: false,
                }}
              />
          </div>
          <div className="flex gap-4 mt-4">
            <Button
              label={"Cancel"}
              className="btn_cancel"
              onClick={() => {
                setIsAddCategoryModal(false);
                reset();
              }}
            />

            <IconButton
              label="Add Item"
              icon={icons.saveIcon}
              type="submit"
              className="my-3"
              loading={loading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}
