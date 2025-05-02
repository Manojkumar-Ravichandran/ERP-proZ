import React from "react";
import styles from "./ToggleSwitch.module.css";

export default function ToggleSwitch({
  id,
  label,
  checked,
  onChange,
}) {
  return (
    <div className={`${styles.toggleContainer} flex align-center items-center`}>
      <label htmlFor={id} className={`${styles.switch}`}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
        />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
      <span className="ps-1 text-sm">
        {label}
      </span>
    </div>
  );
}
