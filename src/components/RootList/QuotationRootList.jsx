import React, { lazy } from "react";
import icons from "../../contents/Icons";
import ACopeQuot from "../../pages/Quotation/AutoGenerate/ACopeQuot";
import ACopeQuotHipRoof from "../../pages/Quotation/AutoGenerate/ACopeQuotHipRoof";

const Quotation = lazy(() => import("../../pages/Quotation/Quotation"));
const AddManualQuotation = lazy(() => import("../../pages/Quotation/Components/AddManualQuotation"));

export const QuotationRootList = {
  path: "quotation/",
  children:[
    {
      index:true,
      element: <Quotation />,
    },
    {
      path:'add-manual-quotation',
      element: <AddManualQuotation />,
    },
    {
      path:'auto-quotation',
      element: <ACopeQuot />,
    },
    {
      path:'auto-quotation-hip',
      element: <ACopeQuotHipRoof />,
    },

  ]
};

export const QuotationNavList = {
  title: "Quotation",
  id: "quotation",
  icon: React.cloneElement(icons?.quotation, { size: 18 }),
  submenu: [
    { title: "Quotation", id: "quotation-list", to: "/user/quotation" },
    { title: "Auto Generate Quotation", id: "auto-generate-quotation", to: "/user/quotation/auto-quotation" },
    { title: "Hip Roof Quotation", id: "auto-generate-quotation-hip", to: "/user/quotation/auto-quotation-hip" },
  ],
};
