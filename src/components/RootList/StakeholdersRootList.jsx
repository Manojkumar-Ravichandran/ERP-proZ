import React, { lazy } from "react";
import icons from "../../contents/Icons";

const Vendor = lazy(() => import("../../pages/Stakeholders/Vendor/Vendor"));
const EditVendor = lazy(() =>
  import("../../pages/Stakeholders/Vendor/EditVendor")
);
const AddVendor = lazy(() =>
  import("../../pages/Stakeholders/Vendor/AddVendor")
);

export const StakeHoldersRootList = {
  path: "stakeholders/",
  children: [
    {
      path: "vendor/",
      children: [
        {
          index: true,
          element: <Vendor />,
        },
        {
          path: "add-vendor",
          element: <AddVendor />,
        },
        {
          path: "edit-vendor",
          element: <EditVendor />,
        },
      ],
    },
  ],
};

export const StakeHoldersNavList = {
  title: "Stakeholders",
  id: "stakeholders",
  icon: React.cloneElement(icons.stakeholderIcon, { size: 18 }),
  submenu: [{ title: "Vendor", to: "/user/stakeholders/vendor" }],
};
