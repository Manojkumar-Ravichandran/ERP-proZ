import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import icons from "../../../contents/Icons";
import material from "../../../assets/img/materialRequ.svg";
import totalstock from "../../../assets/img/totalstock.svg";
import assets from "../../../assets/img/assets.svg";
import FormInput from "../../../UI/Input/FormInput/FormInput";
import { useForm } from "react-hook-form";
import noOfInventory from "../../../assets/img/noofinventory.svg";
import OverviewChart from "./OverviewChart";
import OverviewTable from "./OverviewTable";
import IconButton from "../../../UI/Buttons/IconButton/IconButton";
import OverviewAssetsTable from "./OverviewAssetsTable";
import InventoryTable from "../Dashboard/InventoryTable";
import OverviewTransactionsTable from "./OverviewTransactionsTable";
import { inventoryDetailOverviewMaster } from "../../../redux/Inventory/Master/MasterAction"
import "./Master.css";
import AddItem from "../Materials/Item/AddItem";
import AddAssets from "../Assets/AddAssets"
import MaterialRequestTable from "./MaterialRequestTable";
const MetricsCard = ({ icon, title, value }) => (
    <div className="darkCardBg shadow-md rounded-2xl py-3 pe-4 ">
        <div className='flex justify-between items-center'>
            <img src={icon} alt={title} className="w-12 h-12 mr-4" />
            <h3 className="text-xl font-bold">{value} <span className="font-extralight">Nos</span> </h3>
        </div>
        <div className='px-4'>
            <p className="font-medium pt-3">{title}</p>
        </div>
    </div>
);
const MasterTracker = () => {
    const { register, formState: { errors }, handleSubmit, setValue } = useForm();
    const { uuid } = useParams();
    const dispatch = useDispatch();
    const overviewDetails = useSelector((state) => state.inventoryMaster?.overviewDetail);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        if (uuid) {
            dispatch(inventoryDetailOverviewMaster({ uuid }));
        }
    }, [uuid, dispatch]);
    const metrics = [
        { icon: noOfInventory, title: "Out of Stock", value: overviewDetails?.out_of_stock },
        { icon: material, title: "Material Request", value: overviewDetails?.material_request },
        { icon: assets, title: "Assets", value: overviewDetails?.asset_count },
    ];
    // 

    const [activeTab, setActiveTab] = useState("overview");
    const tabs = [
        { id: "overview", label: " Overview" },
        { id: "item", label: "Item" },
        { id: "assets", label: "Assets" },
        { id: "materialrequest", label: "Material Request" },
        { id: "transaction", label: "Transactions" }
    ];
    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <>
                        <div className="grid grid-cols-[200px_1fr] gap-6">
                            <section className="grid grid-rows-3 gap-6">
                                {metrics.map((metric, index) => (
                                    <MetricsCard key={index} {...metric} />
                                ))}
                            </section>
                            <div className="darkCardBg shadow-md rounded-2xl p-2">
                                <OverviewChart selectedDate={selectedDate} />
                            </div>
                        </div>
                        
                        {/* assets */}
                        
                    </>

                );
            case "item":
                return (
                    <div className="p-2">
                        <OverviewTable uuid={uuid} />
                    </div>
                );

            case "assets":
                return (
                    <div className="p-4">
                        <OverviewAssetsTable uuid={uuid} />
                    </div>
                );
            case "materialrequest":
                return (
                    <div className="p-4">
                        <MaterialRequestTable uuid={uuid} />
                    </div>
                );
            case "transaction":
                return (
                    <div className="p-4">
                        <OverviewTransactionsTable uuid={uuid}/>
                    </div>
                );
            default:
                return <div className="p-4">Select a tab to see the content.</div>;
        }
    };
    return (
        <>
            <div className="border-t p-2 ">
                <div className="flex justify-end mb-5">
                    <FormInput id="date" type="date" register={register} errors={errors} />
                </div>

                <div className="flex border-b">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2 -mb-px ${activeTab === tab.id ? "tab-active" : ""
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mt-4">{renderTabContent()}</div>
            </div>
        </>
    )
};
export default MasterTracker;

