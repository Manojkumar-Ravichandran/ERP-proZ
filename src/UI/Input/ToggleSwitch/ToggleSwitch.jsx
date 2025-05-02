import React from "react";
import styles from "./ToggleSwitch.module.css";

export default function ToggleSwitch({
    id,
    label,
    register,
    validation = {},
    errors
}) {
  return (
    <div className={`${styles.toggleContainer} flex align-center items-center`}>
      <label htmlFor={id} className={`${styles.switch}`}>
        <input type="checkbox" id={id}          
        {...(register && register(id, validation))}
        />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
      <span className="ps-1 text-sm">
        {label}
      </span>
    </div>
  );
}
