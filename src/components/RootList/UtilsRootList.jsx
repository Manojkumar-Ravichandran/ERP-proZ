import React, { lazy } from "react";
import icons from "../../contents/Icons";

const MainUnit = lazy(() => import("../../pages/Utils/Unit/MainUnit"));
const UnitList = lazy(() => import("../../pages/Utils/Unit/UnitList"));
const AddUnit = lazy(() => import("../../pages/Utils/Unit/AddUnit"));
const EditUnit = lazy(() => import("../../pages/Utils/Unit/EditUnit"));
const ListQuery = lazy(() => import("../../pages/Utils/ActivityQuery/ListQuery"));
const Reasons = lazy(() => import("../../pages/Utils/Reasons/Reasons"));
export const UtilsRootList = {
  path: "utils",
  children: [
    {
      path: "unit",
      children: [
        {
          index: true,
          element: <MainUnit />,
        },
        {
          path: "list-unit",
          element: <UnitList />,
        },
        {
          path: "add-unit",
          element: <AddUnit />,
        },
        {
          path: "edit-unit",
          element: <EditUnit />,
        },
      ],
    },
    {
      path: "activityQuery",
      children: [
        {
          index: true,
          element: <ListQuery />,
        },
      ],
    },
    {
      path: "reasons",
      children: [
        {
          index: true,
          element: <Reasons />,
        },
      ],
    }
  ],
};

export const UtilsNavList = {
  title: "Utils",
  id: "utils",
  icon: React.cloneElement(icons.utilsIcon, { size: 18 }),
  submenu: [
    { title: "Unit", id: "unit", to: "/user/utils/unit" },
    { title: "Activity Query", id: "activityQuery", to: "/user/utils/activityQuery" },
    { title: "Reasons", id: "reasons", to: "/user/utils/reasons" },
  ],
};
