import React, { useEffect, useState } from 'react';
import arrowicon from '../../../assets/img/arrowicon.svg';
import { crmDashboard } from '../../../redux/CRM/lead/LeadEffects';

const CommunicationHistoryTable = ({ selectedDate }) => {
    const [historyData, setHistoryData] = useState([]);
    const [visibleData, setVisibleData] = useState([]);  // To hold the visible data
    const [itemsToShow, setItemsToShow] = useState(5);  // Number of items to show at once

    useEffect(() => {
        if (selectedDate) {
            fetchHistoryData(selectedDate);
        } else {
            fetchHistoryData('');
        }
    }, [selectedDate]);

    const fetchHistoryData = (date) => {
        const formattedDate = formatDateForAPI(date);

        crmDashboard({ date: formattedDate })
            .then(response => {
                if (response.data && response.data.status === "success" && response.data.data.com_hist) {
                    const fetchedData = response.data.data.com_hist;
                    setHistoryData(fetchedData); // Store the full communication history data
                    setVisibleData(fetchedData.slice(0, itemsToShow)); // Display first 5 items
                } else {
                    setHistoryData([]);
                    setVisibleData([]);
                }
            })
            .catch(error => {
                console.error("Error fetching communication history:", error);
                setHistoryData([]);
                setVisibleData([]);
            });
    };

    // Function to format the date from YYYY-MM-DD to DD-MM-YYYY for the API
    const formatDateForAPI = (date) => {
        const dateParts = date.split('-');
        return date ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : '';
    };

    const handleViewAllClick = () => {
        const nextItems = historyData.slice(visibleData.length, visibleData.length + 5);
        setVisibleData(prevData => [...prevData, ...nextItems]);  // Append next 5 items to the visible data
    };

    return (
        <div className="overflow-x-auto rounded-2xl darkBgCard">
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr style={{ backgroundColor: 'var(--primary-color)', color: "white" }}>
                        <th className="py-3 px-2 text-left text-white">Lead Id</th>
                        <th className="py-3 px-2 text-left text-white">Employee</th>
                        <th className="py-3 px-2 text-left text-white">Date</th>
                        <th className="py-3 px-2 text-left text-white">Notes</th>
                        <th className="py-3 px-2 text-left text-white">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleData.length > 0 ? (
                        visibleData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-100 even:bg-gray-50 odd:bg-white">
                                <td className="py-3 px-2 border-b border-gray-200 text-sm">{item.lead_leadid}</td>
                                <td className="py-3 px-2 border-b border-gray-200 text-sm">{item.emp_name}</td>
                                <td className="py-3 px-2 border-b border-gray-200 text-sm">{new Date(item.date).toLocaleDateString()}</td>
                                <td className="py-3 px-2 border-b border-gray-200 text-sm" title={item.notes}>{item.notes && item.notes.length > 5 ? item.notes.substring(0, 5) + "..." : item.notes || "N/A"}</td>                                <td className="py-3 px-2 border-b border-gray-200 text-sm">{item.status === 1 ? "Active" : "Inactive"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="py-3 px-2 border-b border-gray-200 text-center text-sm">
                                No communication history available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {historyData.length > visibleData.length && (
                <div className="flex justify-items-end justify-end w-full border p-3 shadow-md cursor-pointer" onClick={handleViewAllClick}>
                    View All <img src={arrowicon} alt="arrow icon" />
                </div>
            )}
        </div>
    );
};

export default CommunicationHistoryTable;
