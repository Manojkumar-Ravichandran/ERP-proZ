import React, { useEffect, useState } from "react";
import Breadcrumps from "../../../../UI/Breadcrumps/Breadcrumps";
import FormCard from "../../../../UI/Card/FormCard/FormCard";
import FormInput from "../../../../UI/Input/FormInput/FormInput";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { validationPatterns } from "../../../../utils/Validation";
import {
  getAllCategoryListEffect,
  getAllUnitListEffect,
} from "../../../../redux/common/CommonEffects";
import Select from "../../../../UI/Select/SingleSelect";
import SubmitBtn from "../../../../UI/Buttons/SubmitBtn/SubmitBtn";
import { useDispatch, useSelector } from "react-redux";
import {
  updateMatItemInprogress,
  updateMatItemInReset,
} from "../../../../redux/Inventory/Material/Item/ItemAction";
import icons from "../../../../contents/Icons";
import SingleCheckbox from "../../../../UI/Input/CheckBoxInput/SingleCheckbox";

export default function EditItem() {
  const location = useLocation();
  const dispatch = useDispatch();
  const initialValues = location?.state || {};
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubategoryList] = useState([]);
  const [toastData, setToastData] = useState();
  const [unitList, setUnitList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { updateItem } = useSelector((state) => state.materialItem);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Item", link: "/user/inventory/material/item/" },
    { id: 3, label: "Edit Item" },

    // { id: 3, label: "Add Lead" },
  ];

  useEffect(() => {
    if (categoryList.length === 0) {
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
    }
  }, [categoryList]);
  useEffect(() => {
    if (unitList.length === 0) {
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
    }
  }, [unitList]);

  const {
    register,
    formState: { touchedFields, errors },
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
  } = useForm({ defaultValues: initialValues });
  useEffect(() => {
    setValue("is_asset",true);
    setValue("is_traceability", initialValues?.is_traceability || false);
  },[initialValues]);

  useEffect(() => {
    reset();
    setLoading(false);
    if (updateItem.success === true) {
      setToastData({
        show: true,
        message: updateItem?.data.message,
        type: "success",
      });
      dispatch(updateMatItemInReset());
      navigate("/user/inventory/material/item");
    } else if (updateItem.error === true) {
      setToastData({ show: true, message: updateItem?.message, type: "error" });
      dispatch(updateMatItemInReset());
    }
  }, [updateItem]);

  const EditItemHandler = (data) => {
    dispatch(updateMatItemInprogress({ ...data }));
  };
  return (
    <>
      <Breadcrumps items={breadcrumbItems} />
      <FormCard title="Edit Item">
        <form onSubmit={handleSubmit(EditItemHandler)}>
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
              id="material_name"
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
              id="material_name"
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
                  value: validationPatterns.spacePattern,
                  message: "Provide Valid Rupees",
                },
              }}
            />
            <FormInput
              label="Sales Rate"
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
                  value: validationPatterns.spacePattern,
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
              checked
            />
          </div>
          <div className="flex justify-end">
            <SubmitBtn label="Save Item" loading={loading} />
          </div>
        </form>
      </FormCard>
    </>
  );
}
