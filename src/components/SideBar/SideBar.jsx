// import React, { useState } from "react";
// import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
// import icons from "../../contents/Icons";
// import { Link } from "react-router-dom";
// import "./SideBar.css";
// import logo from "../../assets/img/logo.png";
// import { CRMNavList } from "../RootList/CRMRootList";
// import { InventoryNavList } from "../RootList/InventoryRootList";
// import { StakeHoldersNavList } from "../RootList/StakeholdersRootList";
// import { HRMNavList } from "../RootList/HRMRootList";
// import { QuotationNavList } from "../RootList/QuotationRootList";
// import { ProjectNavList } from "../RootList/ProjectRootList";
// import { UtilsNavList } from "../RootList/UtilsRootList";
// import { AccountsNavList } from "../RootList/AccountsRootList";

// export default function SideBar() {
//   const [collapsed, setCollapsed] = useState(true);
//   const [open, setOpen] = useState(false);
//   const Menus = [
//     {
//       title: "Dashboard",
//       id: "dashboard",
//       icon: React.cloneElement(icons?.dashboardIcon, { size: 18 }),
//       to: "/user",
//     },
//     {
//       ...CRMNavList,
//     },
//     {
//       ...AccountsNavList,
//     },
//     { ...InventoryNavList },
//     {
//       ...StakeHoldersNavList,
//     },
//     {
//       ...HRMNavList,
//     },
//     {
//       ...QuotationNavList,
//     },
//     { ...ProjectNavList },
//     { ...UtilsNavList },
//     {
//       title: "UI components",
//       id: "uiComponents",
//       icon: React.cloneElement(icons?.employeeIcon, { size: 18 }),
//       to: "/user/Uicomponents",
//     },
//   ];

//   const renderMenuItems = (items) => {
//     return items.map((item) => {
//       if (item.submenu) {
//         return (
//           <SubMenu
//             key={item.title}
//             label={item.title}
//             icon={item.icon}
//             className="darkCardBg"
//           >
//             {renderMenuItems(item.submenu)}
//           </SubMenu>
//         );
//       }
//       return (
//         <MenuItem
//           key={item.title}
//           icon={item.icon}
//           component={<Link to={item.to} />}
//         >
//           {item.title}
//         </MenuItem>
//       );
//     });
//   };

//   return (
//     <div className="nav-menu__container darkCardBg">
//       <Sidebar collapsed={collapsed}>
//         <div className="scrollable-sidebar darkCardBg">
//           <div
//             className={`sidebar-header flex items-center ${
//               collapsed ? "justify-center" : "justify-start"
//             } p-4`}
//           >
//             <Link to="/">
//               <img src={logo} alt="ProZ ERP Logo" width="40px" />
//             </Link>
//             {!collapsed && (
//               <h1 className="font-medium text-xl ml-2">ProZ ERP</h1>
//             )}
//           </div>

//           <Menu
//             renderExpandIcon={({ open }) => (
//               <span>{open ? icons?.arrowup : icons?.arrowdown}</span>
//             )}
//           >
//             {renderMenuItems(Menus)}
//           </Menu>
//         </div>
//       </Sidebar>
//       <button
//         className="nav-menu-btn w-10 h-10  darkCardBg rounded-full px-3"
//         onClick={() => setCollapsed(!collapsed)}
//       >
//         <span>{React.cloneElement(icons?.menu, { size: 24 })}</span>
//         {/* <span>{collapsed ? icons?.expandArrow : icons?.collapseArrow}</span> */}
//       </button>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import icons from "../../contents/Icons";
import { Link } from "react-router-dom";
import "./SideBar.css";
import logo from "../../assets/img/logo.png";
// import { CRMNavList } from "../RootList/CRMRootList";
import { useCRMNavList } from "../RootList/CRMRootList";

import { InventoryNavList } from "../RootList/InventoryRootList";
import { StakeHoldersNavList } from "../RootList/StakeholdersRootList";
import { HRMNavList } from "../RootList/HRMRootList";
import { QuotationNavList } from "../RootList/QuotationRootList";
import { ProjectNavList } from "../RootList/ProjectRootList";
import { UtilsNavList } from "../RootList/UtilsRootList";
import { AccountsNavList } from "../RootList/AccountsRootList";
import { getUserLocalStorage } from "../../utils/utils";
import { WhatsappNavList } from "../RootList/WhatsappList";


export default function SideBar() {
  const crmRoutes = useCRMNavList();
  const [collapsed, setCollapsed] = useState(true);
  const [allowedModules, setAllowedModules] = useState([]);

  useEffect(() => {
    const { token, userInfo } = getUserLocalStorage();
    
    setAllowedModules([...(userInfo?.module || []), 
  // "Quotation"
  ]);
  }, []);
  
  const Menus = [
    {
      title: "Dashboard",
      id: "dashboard",
      icon: React.cloneElement(icons?.dashboardIcon, { size: 18 }),
      to: "/user",
      module: "Dashboard",
    },
    { ...crmRoutes, module: "CRM" },
    { ...AccountsNavList, module: "Accounts" },
    { ...InventoryNavList, module: "Inventory" },
    { ...StakeHoldersNavList, module: "Stakeholders" },
    { ...HRMNavList, module: "HRM" },
    { ...QuotationNavList, module: "Quotation" },
    { ...ProjectNavList, module: "Project" },
    { ...UtilsNavList, module: "Utils" },
    { ...WhatsappNavList, module: "Whatsapp" },

    {
      title: "UI components",
      id: "uiComponents",
      icon: React.cloneElement(icons?.employeeIcon, { size: 18 }),
      to: "/user/Uicomponents",
      module: "UI",
    },
  ];

  // Filter menus based on allowed modules
  const filteredMenus = Menus.filter((menu) =>
    allowedModules.includes(menu.module)
  );

  const renderMenuItems = (items) => {
    return items.map((item) => {
      if (item.submenu) {
        return (
          <SubMenu
            key={item.title}
            label={item.title}
            icon={item.icon}
            className="darkCardBg"
          >
            {renderMenuItems(item.submenu)}
          </SubMenu>
        );
      }
      return (
        <MenuItem
          key={item.title}
          icon={item.icon}
          component={<Link to={item.to} />}
        >
          {item.title}
        </MenuItem>
      );
    });
  };

  return (
    <div className="nav-menu__container darkCardBg">
      <Sidebar collapsed={collapsed}>
        <div className="scrollable-sidebar darkCardBg">
          <div
            className={`sidebar-header flex items-center ${
              collapsed ? "justify-center" : "justify-start"
            } p-4`}
          >
            <Link to="/">
              <img src={logo} alt="ProZ ERP Logo" width="40px" />
            </Link>
            {!collapsed && (
              <h1 className="font-medium text-xl ml-2">ProZ ERP</h1>
            )}
          </div>

          <Menu
            renderExpandIcon={({ open }) => (
              <span>{open ? icons?.arrowup : icons?.arrowdown}</span>
            )}
          >
            {renderMenuItems(filteredMenus)}
          </Menu>
        </div>
      </Sidebar>
      <button
        className="nav-menu-btn w-10 h-10  darkCardBg rounded-full px-3"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span>{React.cloneElement(icons?.menu, { size: 24 })}</span>
      </button>
    </div>
  );
}
