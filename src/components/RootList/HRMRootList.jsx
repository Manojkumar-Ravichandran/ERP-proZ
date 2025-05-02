import React from "react";
import icons from "../../contents/Icons";
import { getUserLocalStorage } from "../../utils/utils";

const getHRMSUrl = () => {
  const { token } = getUserLocalStorage();
  return `${process.env.REACT_APP_HRMS_URL}?token=${token}`;
};
export const HRMNavList = {
  title: "HRM",
  id: "employee",
  icon: React.cloneElement(icons?.employeeIcon, { size: 18 }),
  to: getHRMSUrl(),
  external: true, 
};

export const HRMRootList = null;
