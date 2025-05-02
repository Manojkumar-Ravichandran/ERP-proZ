import './InventoryTable.css';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import action from "../../../assets/img/actionediticon.svg";
import arrowicon from "../../../assets/img/arrowicon.svg";
import { fetchMaterialListOverviewMaster } from '../../../redux/Inventory/Master/MasterAction';
import StatusManager from '../../../UI/StatusManager/StatusManager';

const InventoryTable = ({data}) => {
    const dispatch = useDispatch();
    const [visibleData, setVisibleData] = useState([]);
    const [itemsToShow, setItemsToShow] = useState(5);
    const tableData = useSelector((state) => state.inventoryMaster?.inventoryOverviewMaterial || []);
    // useEffect(() => {
    //     if (uuid) {
    //         dispatch(fetchMaterialListOverviewMaster(uuid));
    //     }
    // }, [uuid, dispatch]);

    useEffect(() => {
        if (tableData.length > 0 && visibleData.length !== itemsToShow) {
            setVisibleData(tableData.slice(0, itemsToShow));
        }
    }, [tableData, itemsToShow]);

    const handleViewAllClick = () => {
        setItemsToShow((prev) => prev + 5);
    };

    const statusHandler = (status) => {
        if (status === 1) {
            // return <span className="badge bg-yellow">Pending</span>;
            return <StatusManager message={"Pending"} status="darkpurple" />;
          } else if (status === 0) {
            return <StatusManager message={"Cancelled"} status="darkpink" />;
          } else if (status === 2) {
            return <StatusManager message={"Approved"} status="lightgreen" />;
          } else if (status === 3) {
            return <StatusManager message={"Declined"} status="darkRed" />;
          }
    }


    return (
        <div className="overflow-x-auto rounded-2xl darkBgCard">
            <table className="min-w-full border-collapse border border-gray-200 ">
                <thead>
                    <tr style={{
                        backgroundColor: 'var(--primary-color)', color: "white"
                    }}>
                        <th className="py-3 px-6 text-left text-white">Date</th>
                        <th className="py-3 px-6 text-left text-white">ID</th>
                        <th className="py-3 px-6 text-left text-white">Item Name</th>
                        <th className="py-3 px-6 text-left text-white">Quantity</th>
                        <th className="py-3 px-6 text-left text-white">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.length > 0 ? (
                        data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-100 even:bg-gray-50 odd:bg-white">
                                <td className="py-3 px-2 border-b border-gray-200">{item.date}</td>
                                <td className="py-3 px-2 border-b border-gray-200">{item?.request_id}</td>
                                <td className="py-3 px-2 border-b border-gray-200">{item?.item}</td>
                                <td className="py-3 px-2 border-b border-gray-200">{item?.quantity||0}</td>
                                <td className="py-3 px-2 border-b border-gray-200 text-sm">{statusHandler(item?.status)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="py-5 border-b border-gray-200 text-center text-sm">
                                No items available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {tableData.length > visibleData.length && (
                <div
                    className="flex justify-end items-center w-full border p-3 shadow-md cursor-pointer"
                    onClick={handleViewAllClick}
                >
                    View All <img src={arrowicon} alt="Arrow Icon" className="ml-2" />
                </div>
            )}
        </div>
    );
};

export default InventoryTable;
