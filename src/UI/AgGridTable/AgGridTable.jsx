// import React, { useState, useEffect, useRef } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import './AgGridTable.css';
// import Loader from '../../components/Loader/Loader';

// const ReusableAgGrid = ({ rowData, columnDefs, onGridReady, gridOptions, tableWidth = '100%' }) => {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   // Helper function to capitalize the first letter
//   const capitalizeFirstLetter = (value) => {
//     if (typeof value === 'string' && value.length > 0) {
//       return value.charAt(0).toUpperCase() + value.slice(1);
//     }
//     return value;
//   };

//   // Add valueFormatter to all columns
//   const formattedColumnDefs = columnDefs.map((colDef) => ({
//     ...colDef,
//     valueFormatter: colDef.field
//       ? (params) => capitalizeFirstLetter(params.value)
//       : colDef.valueFormatter, // Preserve existing formatters if any
//   }));

//   const checkboxColumnDef = {
//     headerCheckboxSelection: true,
//     checkboxSelection: true,
//     headerName: '',
//     minWidth: 91,
//     maxWidth: 91,
//     cellClass: 'center-align',
//   };

//   const combinedColumnDefs = [checkboxColumnDef, ...formattedColumnDefs];
//   const defaultGridOptions = {
//     rowSelection: 'multiple',
//     rowHeight: 70,
//     suppressRowClickSelection: true,
//     suppressServerSideFullWidthLoadingRow: true,
//     ...gridOptions,
//   };
//   const gridRef = useRef();

//   useEffect(() => {
//     const handleResize = () => {
//         if (gridRef.current) {
//             gridRef.current.sizeColumnsToFit();
//         }
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
// }, []);
//   return (
//     <div className="grid-container">
//       {loading && (
//         <div className="loader-overlay">
//           <Loader />
//         </div>
//       )}
//       <div className="ag-theme-alpine" style={{ height: 800, width: tableWidth }}>
//         <AgGridReact
//           className="no-scrollbar"
//           rowData={rowData}
//           onGridReady={onGridReady}
//           gridOptions={defaultGridOptions}
//           columnDefs={combinedColumnDefs}
//           defaultColDef ={{
//             flex:1
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default ReusableAgGrid;

import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./AgGridTable.css";
import Loader from "../../components/Loader/Loader";

const ReusableAgGrid = ({
  rowData,
  columnDefs,
  onGridReady,
  gridOptions,
  tableWidth = "100%",
  showCheckbox = true, // New prop to toggle between checkbox and serial number
  from=0,
  excludeFromCapitalization = [],
}) => {
  const [loading, setLoading] = useState(true);
  const gridRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (value, field) => {
    if (excludeFromCapitalization.includes(field)) {
      // Skip capitalization for excluded fields
      return value;
    }
    if (typeof value === "string" && value.length > 0) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  };

  // Add valueFormatter to all columns
  const formattedColumnDefs = columnDefs.map((colDef) => ({
    ...colDef,
    valueFormatter: colDef.field
      ? (params) => capitalizeFirstLetter(params.value,colDef.field)
      : colDef.valueFormatter, // Preserve existing formatters if any
  }));

  // Checkbox or Serial Number column definition
  const firstColumnDef = showCheckbox
    ? {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerName: "",
        minWidth: 91,
        maxWidth: 91,
        cellClass: "center-align",
      }
    : {
        headerName: "S.No",
        valueGetter: (params) => from!==0? from-1 +params.node.rowIndex + 1: params.node.rowIndex + 1,
        minWidth: 91,
        maxWidth: 91,
        cellClass: "center-align",
      };

  const combinedColumnDefs = [firstColumnDef, ...formattedColumnDefs];
  const defaultGridOptions = {
    rowSelection: "multiple",
    rowHeight: 70,
    suppressRowClickSelection: true,
    suppressServerSideFullWidthLoadingRow: true,
    ...gridOptions,
  };

  // useEffect(() => {
  //   // const handleResize = () => {
  //   //   if (gridRef.current) {
  //   //     gridRef.current.sizeColumnsToFit();
  //   //   }
  //   // };
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <div className="grid-container">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div
        className="ag-theme-alpine darkCardLightBg"
        style={{ width: tableWidth }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={combinedColumnDefs}
          gridOptions={defaultGridOptions}
          domLayout="autoHeight"
          // className="no-scrollbar"
          onGridReady={() => gridRef?.current?.api?.sizeColumnsToFit()}
          defaultColDef={{
            flex: 1,
          }}
        />
      </div>
    </div>
  );
};

export default ReusableAgGrid;
