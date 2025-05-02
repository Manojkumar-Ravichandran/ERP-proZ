import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import icons from '../../../contents/Icons';
import Chart from '../../../UI/Chart/Chart';
import BarChart from '../../../UI/Chart/BarChart';
import CircleChart from '../../../UI/Chart/CircleChart';
import FullCircleChart from '../../../UI/Chart/FullCircleChart';
import noOfInventory from "../../../assets/img/noofinventory.svg";
import material from "../../../assets/img/materialRequ.svg";
import totalstock from "../../../assets/img/totalstock.svg";
import assets from "../../../assets/img/assets.svg";
import InventoryTable from './InventoryTable';
import IconButton from '../../../UI/Buttons/IconButton/IconButton';
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { useForm } from "react-hook-form";
import formatDateForInput from '../../../UI/Date/Date';
import { dashboardEffect } from '../../../redux/Inventory/Dashboard/DashboardEffect';
import DasboardBarChart from './DashboardBarChart';
import PieGraph from '../../../UI/Chart/PieGraph';
const MetricsCard = ({ icon, title, value }) => (
    <div className="darkCardBg shadow-md rounded-2xl py-3 pe-4 ">
        <div className='flex justify-between items-center'>
            <img src={icon} alt={title} className="w-12 h-12 mr-4" />
            <h3 className="text-xl font-bold">{value}</h3>
        </div>
        <div className='px-4'>
            <p className="font-semibold pt-3">{title}</p>
        </div>
    </div>
);

const DashboardInventory = () => {
    const [metrics,setMetrics] = useState([
        { icon: noOfInventory, title: 'Total Inventory', value: '60' },
        { icon: material, title: 'Material Requirements', value: '800' },
        { icon: totalstock, title: 'Total Stock', value: '600' },
        { icon: assets, title: 'Assets', value: '20' },
    ]);
    const { register, formState: { errors }, handleSubmit, setValue } = useForm();
    const [filterData, setFilterData] = useState();
    const [dashData, setDashData]= useState()
    useEffect(() => {
        getData()
    }, []);


    const getData=async()=>{
        const result = await dashboardEffect({});
        console.log(result?.data)
        setDashData(result?.data?.data);
        console.log(dashData?.data?.material_assets)
        setMetrics([
            { icon: noOfInventory, title: 'Total Inventory', value: result?.data?.data?.no_inventory||0 },
        { icon: material, title: 'Material Requirements', value: result?.data?.data?.material_request||0 },
        { icon: totalstock, title: 'Total Stock', value: result?.data?.data?.total_stock||0 },
        { icon: assets, title: 'Assets', value: result?.data?.data?.asset_count||0 },
        ])

    }

    const labels = ["Total Stock", "New Stock", ];
  const colors = ["#43ff64", "#57b94b" ]; // custom colors


    return (
        <div className="container mx-auto p-6 ">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <p className="text-xl font-bold"> Dashboard</p>
                </div>
                <div>

                    <FormInput id="date" type="date" register={register} errors={errors} />
                </div>


            </div>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
                {metrics.map((metric, index) => (
                    <MetricsCard key={index} {...metric} />
                ))}
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="darkCardBg shadow-md rounded-2xl p-6">
                    <div id="salesChart" className="h-50  flex items-center justify-center">
                        {/* <BarChart /> */}
                        {dashData && <DasboardBarChart data={dashData?.material_assets} />}
                    </div>
                </div>
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* <div className="bg-white p-6 darkCardBg shadow-md rounded-2xl "> <CircleChart /></div> */}
                    <div className="bg-white p-6 darkCardBg shadow-md rounded-2xl "> <PieGraph labels={labels} values={[dashData?.total_stock||3,dashData?.new_stock||1]} colors={colors} /></div>
                    <div className="bg-white p-6 darkCardBg shadow-md rounded-2xl ">   <FullCircleChart />  </div>
                </section>
            </section>
            <section className="grid grid-cols-1  gap-6">
                {/* <div>
                    <p className='text-xl font-semibold py-4'>Material Request List</p>
                    <InventoryTable data={dashData?.material_rqlist}/>

                </div> */}
                <div>
                    <div className='flex justify-between items-center mb-4'>
                        <p className='text-xl font-semibold'>Pending Approval List</p>
                        {/* <IconButton label="Request" icon={icons.plusIcon} /> */}
                    </div>

                    <InventoryTable  data={dashData?.pen_material_rqlist}/>

                </div>
            </section>
        </div>
    );
};

export default DashboardInventory;
