import React, { lazy } from "react";
import icons from "../../contents/Icons";
import Whatsapp from "../../pages/Whatsapp/Whatsapp";


export const WhatsappRootList = {
  path: "whatsapp",
  element: <Whatsapp />,
};

export const WhatsappNavList = {
  title: "Whatsapp",
  id: "whatsapp",
  icon: React.cloneElement(icons.whatsappIcon, { size: 18 }),
  to: "/user/whatsapp",

//   submenu: [
//     {
//       title: "Whatsapp",
//       id: "whatsapp",
//       to: "/user/whatsapp",
//     },

//     // {
//     //   title: "project",
//     //   id: "project",
//     //   to: "/user/project",
//     // },

//     // {
//     //   title: "Task",
//     //   id: "task",
//     //   to: "/user/project/task",
//     // },
//     // {
//     //   title: "Task Masters",
//     //   id: "task_masters",
//     //   to: "/user/project/task-masters",
//     // },
//     // {
//     //   title: "Materials",
//     //   id: "materials",
//     //   to: "/user/project/materials",
//     // },
//     // {
//     //   title: "Material Return",
//     //   id: "material_return",
//     //   to: "/user/project/material-return",
//     // },
//   ]
  
};
