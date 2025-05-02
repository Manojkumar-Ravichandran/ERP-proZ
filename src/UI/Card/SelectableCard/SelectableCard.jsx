import React from "react";
import styles from "./SelectableCard.module.css";

const SelectableCard = ({
  id,
  name,
  address,
  contact,
  isSelected,
  onChange,
  disabled = false,
}) => {
  return (
    <label
      className={`card w-full border ${styles.selectable__card} ${
        isSelected ? styles.selected : ""
      } ${disabled ? styles.disabled : ""}`}
      htmlFor={id}
    >
      <div className={`${styles["card--container"]}`}>
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={isSelected}
          onChange={() => onChange(id)}
          className="hidden-input"
          disabled={disabled}
        />
        <p className="text-xl font-semi-bold text primary capitalize">{name}</p>
        <div>{address}</div>
        <div>Cell: {contact}</div>
      </div>
    </label>
  );
};

export default SelectableCard;
