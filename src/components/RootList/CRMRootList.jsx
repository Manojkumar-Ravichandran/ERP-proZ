// // import React, { lazy, useEffect } from "react";
// // import icons from "../../contents/Icons";
// // import TaskList from "../../pages/CRM/Task/TaskList";
// // import { element } from "prop-types";
// // import MyTaskList from "../../pages/CRM/Task/MyTaskList";
// // import CrmDashboard from "../../pages/CRM/CrmDashboard/CrmDashboard";
// // import { getUserLocalStorage } from "../../utils/utils";


// // const { token, userInfo } = getUserLocalStorage(); // Retrieve userInfo directly
// // // This will show the userInfo object in the console
// // const Lead = lazy(() => import("../../pages/CRM/Lead/Lead"));
// // const UpdateLead = lazy(() => import("../../pages/CRM/Lead/UpdateLead"));
// // const CreateLead = lazy(() => import("../../pages/CRM/Lead/CreateLead"));
// // const LeadDetail = lazy(() => import("../../pages/CRM/Lead/LeadDetail"));
// // const Customer = lazy(() => import("../../pages/CRM/Customer/Customer"));
// // const CustomerView = lazy(() =>
// //   import("../../pages/CRM/Customer/CustomerView")
// // );



// // export const CRMRootList = {
// //   path: "crm",
// //   children: [
// //     {
// //       path: "lead/dashboard",
// //       element:<CrmDashboard/>
// //     },
// //     {
// //       index: true,
// //       path: "lead/",
// //       element: <Lead />,
// //     },
// //     {
// //       path: "lead/create-lead",
// //       element: <CreateLead />,
// //     },
// //     {
// //       path: "lead/update-lead",
// //       element: <UpdateLead />,
// //     },
// //     {
// //       path: "lead/detail-lead/:uuid",
// //       element: <LeadDetail />,
// //     },

// //     {
// //       path: "customer/",
// //       children: [
// //         {
// //           index: true,
// //           element: <Customer />,
// //         },
// //         {
// //           path: "customer-view/:uuid",
// //           element: <CustomerView />,
// //         },
// //       ],
// //     },
// //     {
// //       path: "task/",
// //       children: [
// //         {
// //           index: true,
// //           element: <TaskList />,
// //         }
// //       ],
// //     },
// //     {
// //       path: "mytask/",
// //       children: [
// //         {
// //           index: true,
// //           element: <MyTaskList />,
// //         }
// //       ],
// //     },
// //   ],
// // };

// // export const CRMNavList = {
// //   title: "CRM",
// //   id: "crm",
// //   icon: React.cloneElement(icons.crmIcon, { size: 18 }),
// //   submenu: [
// //     { title: "Dashboard", id: "dashboard", to: "/user/crm/lead/dashboard" },
// //     { title: "Lead", id: "lead", to: "/user/crm/lead" },
// //     { title: "Customer", id: "customer", to: "/user/crm/customer" },
// //     // Conditionally add "Task List" only if userInfo.role !== 10
// //     ...(userInfo?.role !== 10
// //       ? [{ title: "Task List", id: "task", to: "/user/crm/task" }]
// //       : []),
// //     { title: "MyTask List", id: "mytask", to: "/user/crm/mytask" },
// //   ],
// // };

// import React, { lazy, useEffect, useState } from "react";
// import icons from "../../contents/Icons";
// import TaskList from "../../pages/CRM/Task/TaskList";
// import MyTaskList from "../../pages/CRM/Task/MyTaskList";
// import CrmDashboard from "../../pages/CRM/CrmDashboard/CrmDashboard";
// import { getUserLocalStorage } from "../../utils/utils";

// const Lead = lazy(() => import("../../pages/CRM/Lead/Lead"));
// const UpdateLead = lazy(() => import("../../pages/CRM/Lead/UpdateLead"));
// const CreateLead = lazy(() => import("../../pages/CRM/Lead/CreateLead"));
// const LeadDetail = lazy(() => import("../../pages/CRM/Lead/LeadDetail"));
// const Customer = lazy(() => import("../../pages/CRM/Customer/Customer"));
// const CustomerView = lazy(() =>
//   import("../../pages/CRM/Customer/CustomerView")
// );

// export function useUserInfo() {
//   const [userInfo, setUserInfo] = useState(getUserLocalStorage()?.userInfo || {});

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const updatedUserInfo = getUserLocalStorage()?.userInfo;
//       setUserInfo(updatedUserInfo);
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, []);

//   return userInfo;
// }



// export const CRMRootList = {
//   path: "crm",
//   children: [
//     {
//       path: "lead/dashboard",
//       element: <CrmDashboard />,
//     },
//     {
//       index: true,
//       path: "lead/",
//       element: <Lead />,
//     },
//     {
//       path: "lead/create-lead",
//       element: <CreateLead />,
//     },
//     {
//       path: "lead/update-lead",
//       element: <UpdateLead />,
//     },
//     {
//       path: "lead/detail-lead/:uuid",
//       element: <LeadDetail />,
//     },
//     {
//       path: "customer/",
//       children: [
//         {
//           index: true,
//           element: <Customer />,
//         },
//         {
//           path: "customer-view/:uuid",
//           element: <CustomerView />,
//         },
//       ],
//     },
//     // Conditionally include "Task List" based on userInfo.role
//     ...(userInfo?.role !== 10
//       ? [
//           {
//             path: "task/",
//             children: [
//               {
//                 index: true,
//                 element: <TaskList />,
//               },
//             ],
//           },
//         ]
//       : []),
//     {
//       path: "mytask/",
//       children: [
//         {
//           index: true,
//           element: <MyTaskList />,
//         },
//       ],
//     },
//   ],
// };

// export const CRMNavList = {
//   title: "CRM",
//   id: "crm",
//   icon: React.cloneElement(icons.crmIcon, { size: 18 }),
//   submenu: [
//     { title: "Dashboard", id: "dashboard", to: "/user/crm/lead/dashboard" },
//     { title: "Lead", id: "lead", to: "/user/crm/lead" },
//     { title: "Customer", id: "customer", to: "/user/crm/customer" },
//     ...(userInfo?.role !== 10
//       ? [{ title: "Task List", id: "task", to: "/user/crm/task" }]
//       : []),
//     { title: "MyTask List", id: "mytask", to: "/user/crm/mytask" },
//   ],
// };

import React, { lazy, useEffect, useState } from "react";
import icons from "../../contents/Icons";
import TaskList from "../../pages/CRM/Task/TaskList";
import MyTaskList from "../../pages/CRM/Task/MyTaskList";
import CrmDashboard from "../../pages/CRM/CrmDashboard/CrmDashboard";
import { getUserLocalStorage } from "../../utils/utils";
import Report from "../../pages/CRM/Report/Report";
import Complaint from "../../pages/CRM/Complaint/Complaint";
import LeadTransfers from "../../pages/CRM/LeadTransfer/LeadTransfers";
import MissedCall from "../../pages/CRM/MissedCall/MissedCall";

const Lead = lazy(() => import("../../pages/CRM/Lead/Lead"));
const UpdateLead = lazy(() => import("../../pages/CRM/Lead/UpdateLead"));
const CreateLead = lazy(() => import("../../pages/CRM/Lead/CreateLead"));
const LeadDetail = lazy(() => import("../../pages/CRM/Lead/LeadDetail"));
const Customer = lazy(() => import("../../pages/CRM/Customer/Customer"));
const EmployeeDashboard = lazy(() =>
  import("../../pages/CRM/Task/EmployeeDashboard")
);
const CustomerView = lazy(() =>
  import("../../pages/CRM/Customer/CustomerView")
);

export function useUserInfo() {
  const [userInfo, setUserInfo] = useState(getUserLocalStorage()?.userInfo || {});

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUserInfo = getUserLocalStorage()?.userInfo;
      setUserInfo(updatedUserInfo);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return userInfo;
}

// Functional component to generate routes dynamically
export function useCRMRoutes() {
  const userInfo = useUserInfo();

  return {
    path: "crm",
    children: [
      {
        path: "lead/dashboard",
        element: <CrmDashboard />,
      },
      {
        index: true,
        path: "lead/",
        element: <Lead />,
      },
      {
        path: "lead/create-lead",
        element: <CreateLead />,
      },
      {
        path: "lead/update-lead",
        element: <UpdateLead />,
      },
      {
        path: "employee-dashboard",
        element: <EmployeeDashboard />,
      },
      {
        path: "lead/detail-lead/:uuid",
        element: <LeadDetail />,
      },
      {
        path: "customer/",
        children: [
          {
            index: true,
            element: <Customer />,
          },
          {
            path: "customer-view/:uuid",
            element: <CustomerView />,
          },
        ],
      },
      ...(userInfo?.role !== 10
        ? [
          {
            path: "task/",
            children: [
              {
                index: true,
                element: <TaskList />,
              },
            ],
          },
        ]
        : []),
      {
        path: "mytask/",
        children: [
          {
            index: true,
            element: <MyTaskList />,
          },
        ],
      },
      {
        path: "report/",
        children: [
          {
            index: true,
            element: <Report />,
          },
        ],
      },
      {
        path: "complaint/",
        children: [
          {
            index: true,
            element: <Complaint />,
          },
        ],
      },
      {
        path: "leadTransfer/",
        children: [
          {
            index: true,
            element: <LeadTransfers />
          },
        ],
      },
      {
        path: "missedcall/",
        children: [
          {
            index: true,
            element: <MissedCall />
          },
        ],
      },
    ],
  };
}

// Functional component to generate navigation menu dynamically
export function useCRMNavList() {
  const userInfo = useUserInfo();

  return {
    title: "CRM",
    id: "crm",
    icon: React.cloneElement(icons.crmIcon, { size: 18 }),
    submenu: [
      { title: "Dashboard", id: "dashboard", to: "/user/crm/lead/dashboard" },
      { title: "Lead", id: "lead", to: "/user/crm/lead" },
      { title: "Customer", id: "customer", to: "/user/crm/customer" },
      {
        title: "Employee", id: "crm-empoyee", submenu: [
          { title: "Employee Dashboard", id: "employee-dashboard", to: "/user/crm/employee-dashboard" },
          ...(userInfo?.role !== 10
            ? [{ title: "Task List", id: "task", to: "/user/crm/task" }]
            : []),
          { title: "MyTask List", id: "mytask", to: "/user/crm/mytask" },
          { title: "Report", id: "report", to: "/user/crm/report" },

        ]
      },
      { title: "Complaint", id: "Complaint", to: "/user/crm/complaint" },
      { title: "Lead Transfer", id: "leadTransfer", to: "/user/crm/leadTransfer" },
      { title: "Missed call", id: "missedcall", to: "/user/crm/missedcall" },


    ],
  };
}
