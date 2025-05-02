import React from 'react';
import Papa from 'papaparse';
import './ExportBtn.css';
import icons from '../../../contents/Icons';

export default function ExportButton({
    label = 'Export',
    data = [],
    filename = 'data',
    className = ''
}) {
    const exportToCSV = () => {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                onClick={exportToCSV} // Directly call exportToCSV
                className={`export-button flex justify-center items-center ${className}`}
            >
                <span className='pe-1 text-base'>{icons.TbFileExport}</span>
                {label}
            </button>
        </div>
    );
}
