import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './FormAgTable';
import Loader from '../../components/Loader/Loader';

const FormTable = ({
  rowData = [],
  columnDefs,
  onGridReady,
  gridOptions,
  tableWidth = '100%',
  showCheckbox = true, // Toggle between checkbox and serial number
}) => {
  const [loading, setLoading] = useState(true);
  const gridRef = useRef();

  useEffect(() => {
    if (rowData.length > 0) {
      setLoading(false);
    }
  }, [rowData]);

  const capitalizeFirstLetter = (value) =>
    typeof value === 'string' && value.length > 0 ? value.charAt(0).toUpperCase() + value.slice(1) : value;

  const formattedColumnDefs = columnDefs.map((colDef) => ({
    ...colDef,
    valueFormatter: colDef.field ? (params) => capitalizeFirstLetter(params.value) : colDef.valueFormatter,
  }));


  const firstColumnDef = showCheckbox
  ? {
      headerCheckboxSelection: true,
      checkboxSelection: (params) => params.data?.cost !== 'Total Amount', // Disable checkbox for Total Amount row
      headerName: '',
      minWidth: 91,
      maxWidth: 91,
      cellClass: 'center-align',
    }
  : {
      headerName: 'S.No',
      valueGetter: (params) => (params.data?.cost === 'Total Amount' ? '' : params.node.rowIndex + 1), // No S.No for Total Amount row
      minWidth: 91,
      maxWidth: 91,
      cellClass: 'center-align',
    };


  const combinedColumnDefs = [firstColumnDef, ...formattedColumnDefs];
  const defaultGridOptions = {
    rowSelection: 'multiple',
    rowHeight: 70,
    suppressRowClickSelection: true,
    suppressServerSideFullWidthLoadingRow: true,
    ...gridOptions, 
    getHeaderCellStyle: () => ({
      backgroundColor: "red", // Ensure header gets the red background
      color: "#fff", // Adjust text color if needed
    }),
  };

  useEffect(() => {
    const handleResize = () => {
      if (gridRef.current) {
        gridRef.current.api.sizeColumnsToFit();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRowStyle = useCallback((params) => {
    if (params?.data?.cost === 'Total Amount') {
      return { fontWeight: 'bold', backgroundColor: '#e0e0e0' };
    }
    return null;
  }, []);

  const normalRowData = rowData.filter((row) => row.cost !== 'Total Amount');
  const pinnedBottomRowData = rowData.filter((row) => row.cost === 'Total Amount');

  return (
    <div className="grid-container">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="ag-theme-alpine darkCardLightBg" style={{ width: tableWidth, height: '100%' }}>
        <AgGridReact
          ref={gridRef}
          className="no-scrollbar"
          rowData={normalRowData}
          pinnedBottomRowData={pinnedBottomRowData}
          onGridReady={onGridReady}
          gridOptions={defaultGridOptions}
          columnDefs={combinedColumnDefs}
          defaultColDef={{
            flex: 1,
          }}
          getRowStyle={getRowStyle}
          domLayout="autoHeight" // Automatically adjust height based on content
        />
      </div>
    </div>
  );
};

export default FormTable;
