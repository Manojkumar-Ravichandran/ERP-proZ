import React from 'react';
 import '../../../Inventory/Dashboard/InventoryTable.css';
import icons from '../../../../contents/Icons';
const Table = ({ headers, data, tableStyles, headerStyles, footerText }) => {
    return (
        <div className={`overflow-x-auto rounded-2xl ${tableStyles.cardBg}`}>
            <table  className="min-w-full border-collapse border border-gray-200 ">
                <thead>
                <tr style={{
                        backgroundColor: 'var(--primary-color)',color:"white"
                    }}>
                        {headers.map((header, index) => (
                            <th key={index} className="px-4 py-2 text-left font-normal">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index} className="border-t">
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-2">{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-end w-full border p-3 shadow-md">
                <button className='flex justify-items-center items-center'>viewAll {icons.IoIosArrowForward}</button>
            </div>
        </div>
    );
};

export default Table;
