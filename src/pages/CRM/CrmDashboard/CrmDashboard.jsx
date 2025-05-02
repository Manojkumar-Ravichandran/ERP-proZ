import { React, useEffect, useState } from 'react';
import FormInput from '../../../UI/Input/FormInput/FormInput';
import { useForm } from "react-hook-form";
import noOfInventory from '../../../assets/img/customer.svg';
import material from '../../../assets/img/lead.svg';
import totalstock from '../../../assets/img/project.svg';
import assets from '../../../assets/img/assets.svg';
import New from '../../../assets/img/New.svg';
import Won from '../../../assets/img/Won.svg';
import Recent from '../../../assets/img/Recent.svg';
import ProjectChart from './ProjectChart';
import StackChart from './StackChart';
import CrmTable from './CrmTable';
import CommunicationHistoryTable from './CommunicationHistoryTable';
import { crmDashboard } from '../../../redux/CRM/lead/LeadEffects';

const MetricsCard = ({ icon, title, value, labelName, labelValue, lableicon }) => (
    <div className="darkCardBg shadow-md rounded-2xl py-3 pe-4">
        <div className='flex items-center'>
            <img src={icon} alt={title} className="w-12 h-12 mr-4" />
            <h3 className="text-xl font-bold">{value}</h3>
        </div>
        <div className='px-4'>
            <p className="font-semibold ">{title}</p>
            <div className='grid grid-cols-4 gap-2 w-33 float-end'>
                <p></p>
                <p></p>
                <p className='w-3 font-semibold'><span className='text-xs mb-1 font-light'>{labelName} </span>{labelValue}</p>
                <img src={lableicon} alt={labelName} className='mt-4' />
            </div>
        </div>
    </div>
);

const CrmDashboard = () => {
    const { register, formState: { errors }, handleSubmit, setValue } = useForm();
    const [dashboardData, setDashboardData] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        // Initialize the date to today's date in YYYY-MM-DD format if no date is selected
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
        fetchData(today);  // Fetch data for today initially
    }, []);

    useEffect(() => {
        if (selectedDate) {
            fetchData(selectedDate);  // Fetch data when selectedDate changes
        }
    }, [selectedDate]);

    const formatDateForAPI = (date) => {
        const dateParts = date.split('-');
        return date ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : ''; // Return formatted date
    };

    const fetchData = (date) => {
        const formattedDate = formatDateForAPI(date);
        

        crmDashboard({ date: formattedDate })
            .then(response => {
                
                if (response.data && response.data.status === "success") {
                    setDashboardData(response.data.data);
                } else {
                    setDashboardData({});
                }
            })
            .catch(error => {
                console.error("Error fetching CRM dashboard data:", error);
                setDashboardData({});
            });
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const { customer = 0, last_week_cust = 0, leads = 0, labelName = 0, open_leads = 0, won_leads = 0, new_pro_leads = 0, pro_leads = 0 } = dashboardData || {};

    const metrics = [
        { icon: noOfInventory, title: 'Customer', value: customer, labelName: 'New', labelValue: last_week_cust, lableicon: New },
        { icon: material, title: 'Lead', value: leads, labelName: 'Won', labelValue: won_leads, lableicon: Won },
        { icon: totalstock, title: 'Project', value: new_pro_leads, labelName: 'Recent', labelValue: pro_leads, lableicon: Recent },
    ];

    return (
        <>
            <div className="mb-4 mt-4 flex justify-between items-center">
                <div>
                    <p className="text-xl font-bold">CRM Dashboard</p>
                </div>
                <div className="flex">
                    <input
                        type="date"
                        id="date"
                        className='p-3 rounded'
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                </div>
            </div>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {metrics.map((metric, index) => (
                    <MetricsCard key={index} {...metric} />
                ))}
            </section>

            <section className="grid grid-cols-12 gap-6 mb-8">
                <div className="col-span-12 lg:col-span-8 darkCardBg shadow-md rounded-2xl p-6">
                    <div className='flex justify-self-end'>
                        <select className="mb-4 p-2 border rounded">
                            <option value="7">Last 7 days</option>
                            <option value="14">Last 14 days</option>
                            <option value="20">Last 20 days</option>
                        </select>
                    </div>
                    <div id="salesChart" className="h-50 flex items-center justify-center">
                        <StackChart selectedDate={selectedDate} />
                    </div>
                </div>
                <section className="col-span-12 lg:col-span-4 darkCardBg shadow-md rounded-2xl p-6">
                    <div className='flex justify-self-end'>
                        <select className="mb-4 p-2 border rounded">
                            <option value="7">Last 7 days</option>
                            <option value="14">Last 14 days</option>
                            <option value="20">Last 20 days</option>
                        </select>
                    </div>
                    <div className="bg-white p-6">
                        <ProjectChart selectedDate={selectedDate} /> {/* Pass selectedDate */}
                    </div>
                </section>
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
                <div>
                    <p className='text-xl font-semibold py-4'>Today Schedule</p>
                    <CrmTable selectedDate={selectedDate} /> {/* Pass selectedDate */}
                </div>
                <div>
                    <div className='flex justify-between items-center'>
                        <p className='text-xl font-semibold py-4'>Communication History</p>
                    </div>
                    <CommunicationHistoryTable selectedDate={selectedDate} /> {/* Pass selectedDate */}
                </div>
            </section>
        </>
    );
};

export default CrmDashboard;

