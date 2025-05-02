import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import ReactDropdownSelect from "react-dropdown-select";

const SearchableSelector = forwardRef(
    (
        {
            label,
            id,
            options,
            placeholder,
            showStar = true,
            disabled = false,
            upper = false,
            register,
            validation = {},
            errors,
            setValue,
            marginClass,
            containerClass,
            defaultValue,
            defaultid, // New prop to handle defaultid
            searchable = true,
            iconLabel
        },
        ref
    ) => {
        const modifiedOptions = [
            { label: placeholder, value: "", disabled: true },
            ...options,
        ];

        const [selectedValue, setSelectedValue] = useState(
            defaultValue ? options.find((option) => option.value === defaultValue) : null
        );

        useEffect(() => {
            if (defaultid) {
                // Find the option corresponding to the defaultid
                const defaultOption = options.find((option) => option.value === defaultid);
                if (defaultOption) {
                    setValue(id, defaultOption.value);
                    setSelectedValue(defaultOption);
                }
            } else if (defaultValue) {
                const defaultOption = options.find((option) => option.value === defaultValue);
                if (defaultOption) {
                    setValue(id, defaultOption.value);
                    setSelectedValue(defaultOption);
                }
            }
        }, [defaultid, defaultValue, setValue, id, options]);

        // const handleDropdownChange = (selected) => {
        //     const value = selected[0]?.value || "";
        //     const label = selected[0]?.label || "";
        //     if (upper) {
        //         setValue(id, value.toUpperCase());
        //         setSelectedValue({ value: value.toUpperCase(), label: label.toUpperCase() });
        //     } else {
        //         setValue(id, value);
        //         setSelectedValue(selected[0]);
        //     }
        // };

        // Expose the clearAll function to the parent component via ref
     
        const handleDropdownChange = (selected) => {
            if (!selected || selected.length === 0) {
                setValue(id, ""); // Reset the form field value
                setSelectedValue(null); // Reset the selected value state
            } else {
                const value = selected[0]?.value || "";
                const label = selected[0]?.label || "";
                const matchedOption = options.find((option) => option.value === value);
        
                if (matchedOption) {
                    // If the value exists in the options, set it
                    if (upper) {
                        setValue(id, value.toUpperCase());
                        setSelectedValue({ value: value.toUpperCase(), label: label.toUpperCase() });
                    } else {
                        setValue(id, value);
                        setSelectedValue(matchedOption);
                    }
                } else {
                    // If the value does not exist, clear the selection
                    setValue(id, "");
                    setSelectedValue(null);
                }
            }
        };
        useImperativeHandle(ref, () => ({
            clearAll: () => {
                setValue(id, "");
                setSelectedValue(null);
            },
        }));

        return (
            <div>
                {label && (
                    <label htmlFor={id}>
                        {iconLabel && <span>{iconLabel}</span>}
                        <span>{label}</span>
                        {showStar && <span className="text-red-500 text-sm"> *</span>}
                    </label>
                )}
                <div
                    className={`bg-white-100 ${
                        errors?.[id] ? "border-red-500" : ""
                    } ${disabled ? "disabled" : ""}`}
                >
                    <ReactDropdownSelect
                        id={id}
                        {...register(id, validation)}
                        options={modifiedOptions}
                        placeholder={placeholder}
                        searchable={searchable}
                        disabled={disabled}
                        clearable={true}
                        clearOnSelect
                        style={{ borderColor: errors[id] ? "red" : "#dbdade" }}
                        onChange={(value) => {
                            if (!value) {
                                handleDropdownChange(null);
                            } else {
                                handleDropdownChange(value);
                            }
                        }}
                        values={selectedValue ? [selectedValue] : []} // Show label instead of id
                    />
                </div>
                {errors[id] && showStar && (
                    <p className={`text-error text-md`}>{errors[id]?.message} </p>
                )}
            </div>
        );
    }
);

export default SearchableSelector;