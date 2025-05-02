import { React, useEffect, useState } from 'react';

import { useForm } from "react-hook-form";
import { ProjectDashboardEffect } from '../../../redux/project/ProjectEffects';
import DateRangePickerComponent from '../../../UI/AgGridTable/DateRangePickerComponent/DateRangePickerComponent';
import moment from 'moment';
import icons from '../../../contents/Icons';
import StackChart from './StackChart';
import { formatDateToYYYYMMDD } from '../../../utils/Date';


// const MetricsCard = ({ icon, title, value, labelName, labelValue, lableicon }) => (
//     <div className="darkCardBg shadow-md rounded-2xl py-3 pe-4">
//         <div className='flex items-center'>
//             <img src={icon} alt={title} className="w-12 h-12 mr-4" />
//             <h3 className="text-xl font-bold">{value}</h3>
//         </div>
//         <div className='px-4'>
//             <p className="font-semibold ">{title}</p>
//             <div className='grid grid-cols-4 gap-2 w-33 float-end'>
//                 <p></p>
//                 <p></p>
//                 <p className='w-3 font-semibold'><span className='text-xs mb-1 font-light'>{labelName} </span>{labelValue}</p>
//                 <img src={lableicon} alt={labelName} className='mt-4' />
//             </div>
//         </div>
//     </div>
// );

const MetricsCard = ({ icon: Icon, value, title, stats }) => (
    <div className="darkCardBg shadow-md rounded-2xl px-4 py-3 text-sm text-gray-800 w-full">
        <div className="flex items-center mb-3">
            <div className="flex items-center justify-center w-12 h-12 mr-3 bg-gray-100 rounded-md border-l-4 border-green-500">
                {Icon && <Icon size={24} className="text-green-600" />}
            </div>
            <div>
                <h3 className="text-2xl font-bold">{value}</h3>
                <p className="text-gray-600 text-sm">{title}</p>
            </div>
        </div>

        <div className="flex flex-wrap gap-x-2 text-xs font-medium border-t pt-2 ">
            {stats.map(({ label, value, color, icon: StatIcon }, idx) => (
                <div key={idx} className="flex items-center gap-1">
                    {StatIcon && <StatIcon size={12} className={`text-gray-700 ${color || ''}`} />}
                    {!StatIcon && <span className={`w-2 h-2 rounded-full ${color}`} />}
                    <span>{label}:</span>
                    <span className="text-black">{value}</span>
                    {idx !== stats.length - 1 && <span className="text-gray-300">|</span>}
                </div>
            ))}
        </div>
    </div>
);

const ProjectDashboard = () => {
    const { register, formState: { errors }, handleSubmit, setValue } = useForm();
    const [dashboardData, setDashboardData] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [filters, setFilters] = useState({
        startDate: moment().subtract(30, "days"), // 30 days ago
        endDate: moment(), // Current date
    });
    console.log("dashboardData", dashboardData)
    useEffect(() => {
        fetchData();  // Fetch data for today initially
    }, [filters]);


    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await ProjectDashboardEffect({
                from_date: filters.startDate ? formatDateToYYYYMMDD(filters.startDate) : "",
                to_date: filters.endDate ? formatDateToYYYYMMDD(filters.endDate) : "",
            }); // Replace with your API endpoint
            if (response?.data?.status === 'success') {
                setDashboardData(response?.data?.data);
            }
        } catch (err) {
            console.error('Error fetching metrics data:', err);
        } finally {
            setLoading(false);
        }

    };


    const handleDateChange = ({ startDate, endDate }) => {
        setFilters((prev) => ({ ...prev, startDate, endDate }));
    };



    return (
        <>
            <div className="mb-4 mt-4 flex justify-between items-center">
                <div>
                    <p className="text-xl font-bold">Project Dashboard</p>
                </div>
                <div className="flex">
                    <DateRangePickerComponent className="darkCardBg"
                        focusedInput={focusedInput}
                        onFocusChange={setFocusedInput}
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        onDatesChange={handleDateChange}
                    />
                </div>
            </div>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <MetricsCard
                    icon={icons?.invoiceIcon}
                    value={dashboardData?.total_project}
                    title="Current Projects"
                    stats={[
                        { label: 'In Progress', value: dashboardData?.in_progress_project, icon: icons?.statusDot, color: 'text-blue-600' },
                        { label: 'Pending', value: dashboardData?.pending_project, icon: icons?.statusDot, color: 'text-yellow-500' },
                        { label: 'On Hold', value: dashboardData?.on_hold_project || 0, icon: icons?.statusDot, color: 'text-red-600' },
                    ]}
                />

                <MetricsCard
                    icon={icons?.taskIcon}
                    value={dashboardData?.total_task}
                    title="Total Tasks Assigned"
                    stats={[
                        { label: 'Completed', value: dashboardData?.completed_task, icon: icons.statusDot, color: 'text-green-600' },
                        { label: 'In Progress', value: dashboardData?.inprogress_task, icon: icons.statusDot, color: 'text-blue-600' },
                        { label: 'Pending', value: dashboardData?.pending_task, icon: icons.statusDot, color: 'text-yellow-500' },
                    ]}
                />

                <MetricsCard
                    icon={icons?.materialIcon}
                    value={dashboardData?.total_material}
                    title="Total Materials"
                    stats={[
                        { label: 'Materials Spent', value: dashboardData?.spent_material, color: 'bg-green-600' },
                        { label: 'Materials Remaining', value: dashboardData?.remaining_material, color: 'bg-yellow-600' },
                    ]}
                />
            </section>

            <section className="grid grid-cols-12 gap-6 mb-8">
                <div className="col-span-12 lg:col-span-8 darkCardBg shadow-md rounded-2xl p-6">
                    {/* <div className='flex justify-self-end'>
                        <select className="mb-4 p-2 border rounded">
                            <option value="7">Last 7 days</option>
                            <option value="14">Last 14 days</option>
                            <option value="20">Last 20 days</option>
                        </select>
                    </div> */}
                    <div className='flex justify-self-center font-semibold'>Project Performance Overview</div>
                    <div id="salesChart" className="h-50 flex items-center justify-center">
                        <StackChart project_graph={dashboardData?.project_graph} />
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 darkCardBg shadow-md rounded-2xl p-6">
                    {/* <div className='flex justify-self-end'>
                        <select className="mb-4 p-2 border rounded">
                            <option value="7">Last 7 days</option>
                            <option value="14">Last 14 days</option>
                            <option value="20">Last 20 days</option>
                        </select>
                    </div> */}
                    <div className='flex justify-self-center font-semibold'>Category Completion</div>
                    {/* <div id="salesChart" className="h-50 flex items-center justify-center">
                        <StackChart project_graph={dashboardData?.project_graph} />
                    </div> */}
                </div>

                    {/* <div className='flex justify-self-end'>
                        <select className="mb-4 p-2 border rounded">
                            <option value="7">Last 7 days</option>
                            <option value="14">Last 14 days</option>
                            <option value="20">Last 20 days</option>
                        </select>
                    </div> */}
                    {/* <div className="bg-white p-6"> */}
                        {/* <ProjectChart selectedDate={selectedDate} /> Pass selectedDate */}
                    {/* </div> */}
                {/* </section> */}
            </section>

        </>
    );
};

export default ProjectDashboard;

