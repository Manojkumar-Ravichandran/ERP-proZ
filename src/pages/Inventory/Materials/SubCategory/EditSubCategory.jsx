import React, { useEffect, useState } from 'react'
import Breadcrumps from '../../../../UI/Breadcrumps/Breadcrumps'
import FormCard from '../../../../UI/Card/FormCard/FormCard';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import { getAllCategoryListEffect } from '../../../../redux/common/CommonEffects';
import FormInput from '../../../../UI/Input/FormInput/FormInput';
import { validationPatterns } from '../../../../utils/Validation';
import Select from '../../../../UI/Select/SingleSelect';
import SubmitBtn from '../../../../UI/Buttons/SubmitBtn/SubmitBtn';

export default function EditSubCategory() {
  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    {
      id: 2,
      label: "Sub category",
      link: "/user/inventory/material/subcategory",
    },
    { id: 3, label: "Edit Sub category" },
  ];
  const location = useLocation();
  const initialValues = location?.state ||{};
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false)

  const {
    register,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
    handleSubmit,
  } = useForm({ defaultValues: initialValues });

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
  }, []);
  return (
    <>
      {/* <Breadcrumps items={breadcrumbItems}/>
      <FormCard title="Edit Subcategory">
      <div className="grid lg:grid-cols-3 grid-cols-3 gap-4 mt-2">
            <FormInput
              label="Sub Category Name"
              placeholder="Enter Sub Category Name"
              register={register}
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
            <Select
              options={categoryList}
              label="Category"
              id="category_name"
              placeholder="Select Category"
              register={register}
              validation={{ required: "Category is required" }}
              errors={errors}
            />
          </div>
          <div className="flex justify-end" >
            <SubmitBtn label="Edit SubCategory" loading={loading} />

          </div>

      </FormCard> */}
    </>
  )
}
