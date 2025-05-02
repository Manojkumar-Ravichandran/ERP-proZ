import React, { useState, useEffect } from "react";
import icons from "../../../contents/Icons"; // Make sure to import the icons

const List = ({ data = [], columns = [], options = [], onAction }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null); // Track the currently open dropdown

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

  const handleOptionClick = (action, item) => {
    onAction(action, item);
    setOpenDropdownId(null); // Close dropdown after action
  };

  return (
    <div>
      <table className="min-w-full">
        <thead className="text-left">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="pe-3">{col.headerName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-primary-40 ps-3">
              {columns.map((col, colIndex) => {
                if (col.field === "action") {
                  return (
                    <td key={colIndex} className="py-3">
                      {/* Action column with 3-dot dropdown */}
                      <div className="relative">
                        <button
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
                                  onClick={() => handleOptionClick(option.action, item)}
                                  className="option"
                                >
                                  <span className="option-icon py-2 ps-1">{option.icon}</span>
                                  <span className="font-light pe-2">{option.label}</span>
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
                  <td key={colIndex} className="py-3">{item[col.field]}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
