import React from "react";
import material from "../../../../assets/img/materialRequ.svg";

const NumberOfTransaction = ({ value = 0 }) => {
  return (
    <div className="darkCardBg shadow-md rounded-2xl py-3 pe-4">
      <div className="flex justify-between items-center">
        <img
          src={material}
          alt="Material Requirements"
          className="w-12 h-12 mr-4"
          data-tooltip-id="mat-tooltip"
          data-tooltip-content="This is material requirements"
        />

        <h3 className="text-xl font-bold">{value}</h3>
      </div>
      <div className="px-4">
        <p className="font-semibold pt-3"> Number Of Transaction</p>
      </div>
    </div>
  );
};

export default NumberOfTransaction;
