// src/pages/Accounts/InventoryCards/TotalInventory.jsx
import React from "react";
import noOfInventory from "../../../../assets/img/noofinventory.svg";

const TotalPaymentReceived = ({ value = 0 }) => (
  <div className="darkCardBg shadow-md rounded-2xl py-3 pe-4">
    <div className="flex justify-between items-center">
      <img
        src={noOfInventory}
        alt="Total Inventory"
        className="w-12 h-12 mr-4"
      />
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
    <div className="px-4">
      <p className="font-semibold pt-3">Total Payment Recevied</p>
    </div>
  </div>
);

export default TotalPaymentReceived;
