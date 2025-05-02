import React, { useState, useEffect } from "react";
import icons from "../../../contents/Icons"; // Make sure to import the icons

const UnitList = ({ data = [], columns = [], itemsPerPage = 10, currentPage = 1,  options = [], onAction,hasBorder = true,  }) => {
  const [currentPageState, setCurrentPageState] = useState(currentPage); // Local state to manage page
  const [openDropdownId, setOpenDropdownId] = useState(null); // Track the currently open dropdown

  useEffect(() => {
    setCurrentPageState(currentPage); // Sync the state with the current page prop
  }, [currentPage]);

  useEffect(() => {
    // Close dropdown if user clicks outside
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-menu")) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const getPaginatedData = () => {
    const startIndex = (currentPageState - 1) * itemsPerPage;
    return Array.isArray(data) ? data.slice(startIndex, startIndex + itemsPerPage) : [];
  };
    const [isOpen, setIsOpen] = useState(false);

  const paginatedData = getPaginatedData();
  const handleOptionClick = (action ,item) => {
    onAction(action , item);
    setIsOpen(false); // Close dropdown after action
};
  return (
    <div>
      <table className={`min-w-full ${hasBorder ? "border border-gray-300" : ""}`}>
      <thead className={`${hasBorder ? "border-b border-gray-300" : "text-left"}`}>
      <tr>
            {columns.map((col, index) => (
              <th key={index} className={`${hasBorder ? "border-b border-gray-300 p-3" : "pe-3"}`}>{col.headerName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, rowIndex) => (
            <tr key={rowIndex} className={`hover:bg-primary-40 ps-3 ${
              hasBorder ? "border-b border-gray-300" : ""
            }`}>
              {columns.map((col, colIndex) => {
                if (col.field === "action") {
                  return (
                    <td key={colIndex} className={`py-3 ${
                      hasBorder ? "border border-gray-300 text-center" : ""
                    }`}>
                      {/* Action column with 3-dot dropdown */}
                      <div className="relative">
                        <button
                          className=""
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(openDropdownId === item.id ? null : item.id); // Toggle dropdown
                          }}
                        >
                          {/* 3-dot icon */}
                          {icons.more}
                        </button>
                        {/* Show dropdown if this is the open one */}
                        {openDropdownId === item.id && (
                          <div
                            className="dropdown-menus p-2 absolute right-0 mt-2 z-50 bg-white-50 border rounded shadow-lg darkCardBg"
                          >
                            <ul>
                            {options.map((option, index) => (
                            <li
                                key={index}
                                onClick={() => handleOptionClick(option.action,item)}
                                className="option"
                            >
                                <span className="option-icon py-2 ps-1">{option.icon}</span>
                              <span className="font-light pe-2"> {option.label}</span> 
                            </li>
                        ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                }
                return (
                  <td key={colIndex}  className={`py-3 ${
                    hasBorder ? "border border-gray-300 text-center" : ""
                  }`}>{item[col.field]}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UnitList;
