import React, { useState } from "react";
import { BsArrowLeftShort, BsChevronDown } from "react-icons/bs";
import { AiOutlineBarChart } from "react-icons/ai";
import { NavLink, useLocation } from "react-router-dom";
import icons from "../../contents/Icons";
import './SideBar.css';

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeInnerSubmenu, setActiveInnerSubmenu] = useState(null); // Add for inner submenu tracking
  const [hoveredSubmenu, setHoveredSubmenu] = useState(null);
  const location = useLocation();
  const [hoveredInnerSubmenu, setHoveredInnerSubmenu] = useState(null); // Added this line
  const Menus = [
    { title: "Dashboard", icon: icons?.dashboardIcon, to: "/user" },
    {
      title: "CRM",
      icon: icons.crmIcon,
      submenu: true,
      submenuItems: [
        { title: "Lead", to: "/user/crm/lead" },
        { title: "Customer", to: "/user/crm/customer" },
      ],
    },
    {
      title: "Inventory",
      icon: icons?.inventoryIcon,
      submenu: true,
      submenuItems: [
        {
          title: "Material",
          innerSubmenu: true,
          subsubmenu: [
            { title: "Category", to: "/user/inventory/material/category" },
            { title: "Sub Category", to: "/user/inventory/material/subcategory" },
            { title: "Item", to: "/user/inventory/material/item" },
          ],
        },
        { title: "Purchase", to: "/user/inventory/purchase" },
      ],
    },
    {
      title: "Stakeholders",
      icon: icons.stakeholderIcon,
      submenu: true,
      submenuItems: [
        { title: "Vendor", to: "/user/stakeholders/vendor" },
      ],
    },
    { title: "Employee", icon: icons?.employeeIcon, to: "/user/employee" },
    { title: "Quotation", icon: icons?.quotation, to: "/user/quotation" },
    { title: "Project", icon: icons.projectIcon, to: "/user/project" },
    { title: "Reports", icon: <AiOutlineBarChart /> },
    {
      title: "Utils", icon: icons?.utilsIcon,
      submenu: true,
      submenuItems: [{ title: "Unit", to: "/user/utils/unit" }]
    },
    { title: "Uicomponents", icon: icons?.employeeIcon, to: "/user/Uicomponents" },
  ];

  const handleSubmenuToggle = (index, e) => {
    if (Menus[index].submenu) {
      e.preventDefault(); // Prevent navigation for parent submenu
      setActiveSubmenu(activeSubmenu === index ? null : index);
      setHoveredSubmenu(null);
    }
  };

  const handleInnerSubmenuToggle = (index, idx, e) => {
    e.preventDefault(); // Prevent navigation for parent inner submenu
    setActiveInnerSubmenu(activeInnerSubmenu === `${index}-${idx}` ? null : `${index}-${idx}`);
  };

  return (
    <>
      <div
        className={`darkCardBg menu--bar h-screen relative ${isOpen ? "w-62" : "w-30"}`}>
        <ul
          className="pt-2 px-5 menu--bar__items overflow-y-auto"
          onMouseLeave={() => {
            setHoveredSubmenu(null);
            setHoveredInnerSubmenu(null); // Added this line
          }}
          style={{ maxHeight: "calc(100vh - 64px)" }}
        >
          {Menus.map((menu, index) => (
            <li key={index}>
              <NavLink
                to={menu.to || "#"}
                activeClassName="active"
                onClick={(e) => menu.submenu && handleSubmenuToggle(index, e)}
                className={`nav--link text-sm flex items-center gap-x-4 cursor-pointer rounded-md ${menu.spacing ? "mt-9" : "mt-2"
                  }`}
                onMouseEnter={() =>
                  !isOpen && menu.submenu && setHoveredSubmenu(index)
                }
                style={{
                  backgroundColor:
                    location.pathname === menu.to ? "var(--primary-color)" : "",
                  color:
                    location.pathname === menu.to
                      ? "white"
                      : "",
                }}
              >
                <span className="text-2xl">
                  {React.cloneElement(menu.icon, { size: 22 })}
                </span>
                {isOpen && (
                  <span className="text-base font-medium flex-1">
                    {menu.title}
                  </span>
                )}
                {menu.submenu && isOpen && (
                  <BsChevronDown
                    className={`${activeSubmenu === index ? "rotate-180" : ""
                      }`}
                  />
                )}
              </NavLink>

              {/* Submenu */}
              {menu.submenu && activeSubmenu === index && isOpen && (
                <ul>
                  {menu.submenuItems.map((submenuItem, idx) => (
                    <li key={idx}>
                      {!submenuItem.innerSubmenu ? (
                        <NavLink
                          to={submenuItem.to}
                          activeClassName="active"
                          className="text-m flex font-medium items-center gap-x-4 cursor-pointer p-2 px-12 hover:bg-light-white rounded-md"
                          style={{
                            backgroundColor:
                              location.pathname === submenuItem.to
                                ? "var(--primary-color)"
                                : "",
                            color:
                              location.pathname === submenuItem.to
                                ? "white"
                                : "",
                          }}
                        >
                          {submenuItem.title}
                        </NavLink>
                      ) : (
                        <div>
                          <div
                            className="text-m flex font-medium items-center gap-x-4 cursor-pointer p-2 ps-12 hover:bg-light-white rounded-md"
                            onClick={(e) =>
                              handleInnerSubmenuToggle(index, idx, e)
                            }
                            style={{
                              color: "",
                            }}
                          >
                            {submenuItem.title}
                            <BsChevronDown
                              className={`ml-auto ${activeInnerSubmenu === `${index}-${idx}`
                                ? "rotate-180"
                                : ""
                                }`}
                            />
                          </div>
                          {activeInnerSubmenu === `${index}-${idx}` && (
                            <ul className="ml-6">
                              {submenuItem.subsubmenu.map(
                                (innerSubmenuItem, idy) => (
                                  <li key={idy}>
                                    <NavLink
                                      to={innerSubmenuItem.to}
                                      activeClassName="active"
                                      className="text-m flex items-center gap-x-4 cursor-pointer p-2 ps-10 hover:bg-light-white rounded-md"
                                      style={{
                                        backgroundColor:
                                          location.pathname ===
                                            innerSubmenuItem.to
                                            ? "var(--primary-color)"
                                            : "",
                                        color:
                                          location.pathname ===
                                            innerSubmenuItem.to
                                            ? "white"
                                            : "",
                                      }}
                                    >
                                      {innerSubmenuItem.title}
                                    </NavLink>
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Hover submenu for collapsed view */}
              {menu.submenu &&
                hoveredSubmenu === index &&
                !isOpen && (
                  <ul
                    className="submenu--hover absolute left-full darkCardBg shadow-lg rounded-md"
                    style={{
                      marginTop:
                        index === 1 ? '86%' :
                          index === 2 ? '130%' :
                            index === 3 ? '200%' :
                              index === 7 ? '440%' :
                                '0%'
                    }}
                  >
                    {menu.submenuItems.map((submenuItem, idx) => (
                      <li 
                        key={idx}
                        className="text-sm flex items-center gap-x-4 cursor-pointer p-0 hover:bg-light-white rounded-md"
                        onMouseEnter={() => submenuItem.innerSubmenu && setHoveredInnerSubmenu(`${index}-${idx}`)}
                      //  onMouseLeave={() => submenuItem.innerSubmenu && setHoveredInnerSubmenu(null)}
                      >
                        <NavLink className="sub-nav-links"
                          to={submenuItem.to||'#'}
                          activeClassName="active"
                        >{submenuItem.title}</NavLink>
                        {/* Inner Subsubmenu */}
                        {submenuItem.innerSubmenu && hoveredInnerSubmenu === `${index}-${idx}` && (
                          <ul className="submenu--hover absolute left-full darkCardBg shadow-lg rounded-md ps-1">
                            {submenuItem.subsubmenu.map((innerSubmenuItem, idy) => (
                              <li 
                                key={idy}
                                className="text-sm flex items-center gap-x-4 cursor-pointer hover:bg-light-white rounded-md"
                              >
                                <NavLink className="sub-nav-links"
                                  to={innerSubmenuItem.to}
                                  activeClassName="active"
                                >
                                  {innerSubmenuItem.title}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
            </li>
          ))}
        </ul>
        <div onClick={() => setIsOpen(!isOpen)} >
          <div
            className={`fixed bottom-0 w-full flex items-center cursor-pointer py-2 ps-5 footer`}
            style={{ width: isOpen ? '233px' : '80px' }}>
            <BsArrowLeftShort className={`text-3xl cursor-pointer z-10 ${!isOpen && "rotate-180"}`} />
            {isOpen && <span className="ps-3">Collapse View</span>}
          </div>
        </div>
      </div>
    </>
  );
}
