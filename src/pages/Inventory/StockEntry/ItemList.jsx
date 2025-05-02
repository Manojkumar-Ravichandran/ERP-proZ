import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import SearchableSelect from "../../../UI/Select/SearchableSel";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { validationPatterns } from "../../../utils/Validation";
import { getAllItemListEffect, getAllUnitListEffect } from "../../../redux/common/CommonEffects";

export default function ItemList() {
  const methods = useForm({
    defaultValues: {
      material_id: "",
      quantity: "",
      unit: "",
      item_name: "",
    },
  });

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const [itemList, setItemList] = useState([]);
  const [filteredItemList, setFilteredItemList] = useState([]);
  const selectedMaterialId = watch("material_id");

  useEffect(() => {
    // Automatically update unit and item name based on selected material
    if (selectedMaterialId) {
      const selectedMaterial = itemList.find(
        (item) => item.value === selectedMaterialId
      );
      if (selectedMaterial) {
        setValue("unit", selectedMaterial.unit_name); // Update the unit
        setValue("item_name", selectedMaterial.material_name); // Update the item name
      } else {
        setValue("unit", "");
        setValue("item_name", "");
      }
    }
  }, [selectedMaterialId, setValue, itemList]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: itemData } = await getAllItemListEffect();
        setItemList(
          itemData?.data.map((item) => ({
            label: `${item.material_name} ${
              item?.material_code ? "-" + item?.material_code : ""
            }`,
            value: item.id,
            unit_name: item.unit_name, // Include unit_name
            material_name: item.material_name, // Include material_name
          }))
        );
        setFilteredItemList(itemData?.data); // Initialize filtered item list
      } catch (error) {
        console.error("Error fetching item data:", error);
        setItemList([]);
      }
    };

    fetchData();
  }, []);

  return (
    <FormProvider {...methods}>
      <div>
        {/* Searchable Select for Item */}
        <SearchableSelect
          options={itemList}
          label="Item Name"
          id="material_id"
          className="w-50"
          placeholder="Select Item"
          register={register}
          validation={{ required: "Item is Required" }}
          errors={errors}
        />

        {/* Quantity Input */}
        <FormInput
          label="Quantity"
          type="number"
          placeholder="Enter Quantity"
          register={register}
          id="quantity"
          errors={errors}
          validation={{
            required: "Quantity is Required",
            pattern: {
              value: validationPatterns.numberOnly,
              message: "Provide Valid Quantity",
            },
          }}
        />

        {/* Unit Display */}
        <FormInput
          label="Unit"
          type="text"
          id="unit"
          placeholder="Auto-filled based on item"
          register={register}
          disabled={true} // Make unit field non-editable
          errors={errors}
        />
      </div>
    </FormProvider>
  );
}
