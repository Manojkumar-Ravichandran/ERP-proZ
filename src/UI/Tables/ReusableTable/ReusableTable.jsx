import React from "react";
import './ReusableTable.css';
const ReusableTable = ({
  columns,
  data,
  rowKey = "id",
  emptyMessage = "No data available",
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed reusable-table">
        <thead>
          <tr
            style={{ backgroundColor: "var(--primary-color)", color: "white" }}
          >
            {columns.map((col) => (
              <th key={col.key} className="py-3 px-6 text-left text-white">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((item) => (
              <tr
                key={item[rowKey]}
                className="hover:bg-gray-100 even:bg-gray-50 odd:bg-white"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="py-3 px-2 border-b border-gray-200 text-sm"
                  >
                    {typeof col.render === "function"
                      ? col.render(item[col.key], item)
                      : item[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
