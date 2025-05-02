import React, { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";

const SliderInput = ({ 
  name = "", 
  label = "", 
  defaultValue, 
  setValue = () => {}, 
  register = () => {}, 
  errors = {} 
}) => {
  const [currentValue, setCurrentValue] = useState(defaultValue);

  useEffect(() => {
    register(name, { required: `${label} is required` });
    setValue(name, defaultValue || 0);
  }, [register, setValue, name, label, defaultValue]);

  // Update both local state and form value when slider changes
  const handleChange = (val) => {
    setCurrentValue(val);
    setValue(name, val);
  };

  // Register the field and set initial value
  // useEffect(() => {
  //   if (typeof register === 'function') {
  //     register(name, { 
  //       required: `${label} is required`,
  //       value: defaultValue ||0
  //     });
  //     if (typeof setValue === 'function') {
  //       setValue(name, defaultValue);
  //     }
  //   }
  // }, [register, name, label, defaultValue, setValue]);

  // Custom handle with always-visible tooltip
  const handleRender = (node, handleProps) => {
    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={currentValue}
        visible={true}
        placement="top"
        key={handleProps.index}
      >
        {node}
      </Tooltip>
    );
  };

  return (
    <div className="slider-container  m-2" >
      <label className="block text-sm font-medium text-gray-700 mb-4">
        {label}
      </label>  
      <Slider
        min={0}
        max={100}
        step={1}
        value={currentValue}
        marks={{
          0: "0%",
          25: "25%",
          50: "50%",
          75: "75%",
          100: "100%"
        }}
        handleRender={handleRender}
        onChange={handleChange}
      />
      
      {errors && errors[name] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[name]?.message}
        </p>
      )}
    </div>
  );
};

export default SliderInput;