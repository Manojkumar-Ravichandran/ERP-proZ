import React, { useEffect, useState } from 'react';
import arrowicon from '../../../assets/img/arrowicon.svg';
import { crmDashboard } from '../../../redux/CRM/lead/LeadEffects';

const CrmTable = ({ selectedDate }) => {
    const [dashboardData, setDashboardData] = useState({ schedule_list: [] });
    const [rowsToShow, setRowsToShow] = useState(5);

    useEffect(() => {
        if (selectedDate) {
            fetchDashboardData(selectedDate);
        } else {
            fetchDashboardData(''); 
        }
    }, [selectedDate]);

    const fetchDashboardData = (date) => {
        const formattedDate = formatDateForAPI(date);

        crmDashboard({ date: formattedDate })
            .then(response => {
                if (response.data && response.data.status === "success") {
                    setDashboardData(response.data.data);
                } else {
                    setDashboardData({ schedule_list: [] });  // Handle case with no data
                }
            })
            .catch(error => {
                console.error("Error fetching CRM dashboard data:", error);
                setDashboardData({ schedule_list: [] });  // Set empty data in case of error
            });
    };

    // Function to format the date from YYYY-MM-DD to DD-MM-YYYY for the API
    const formatDateForAPI = (date) => {
        const dateParts = date.split('-');
        return date ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : '';  // Return formatted date or empty string
    };
     // Function to handle "View All" button click
     const handleViewAll = () => {
        setRowsToShow(prev => prev + 5);  // Show 5 more rows each time
    };

    return (
        <div className="overflow-x-auto rounded-2xl darkBgCard">
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr style={{ backgroundColor: 'var(--primary-color)', color: "white" }}>
                        <th className="py-3 px-6 text-left text-white">Employee</th>
                        <th className="py-3 px-6 text-left text-white">Lead ID</th>
                        <th className="py-3 px-6 text-left text-white">Lead Name</th>
                        <th className="py-3 px-6 text-left text-white">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {dashboardData?.schedule_list?.length > 0 ? (
                        dashboardData.schedule_list.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-100 even:bg-gray-50 odd:bg-white">
                                <td className="py-3 px-2 border-b border-gray-200 text-sm">{item.emp_name}</td>
                                <td className="py-3 px-2 border-b border-gray-200 text-sm">{item.lead_leadid}</td>
                                <td className="py-3 px-2 border-b border-gray-200 text-sm">{item.lead_name}</td>
                                <td className="py-3 px-2 border-b border-gray-200 text-sm">
                                    {item.is_completed ? "Completed" : "Pending"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4 text-gray-500">
                                No schedules available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {dashboardData.schedule_list.length > rowsToShow && (
                <div className="flex justify-items-end justify-end w-full border p-3 shadow-md cursor-pointer" onClick={handleViewAll}>
                    View All <img src={arrowicon} alt="arrow icon" />
                </div>
            )}
            {/* <div className="flex justify-items-end justify-end w-full border p-3 shadow-md">
                View All <img src={arrowicon} alt="arrow icon" />
            </div> */}
        </div>
    );
};

export default CrmTable;
