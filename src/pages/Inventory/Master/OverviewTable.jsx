import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import actionIcon from "../../../assets/img/actionediticon.svg";
import arrowIcon from "../../../assets/img/arrowicon.svg";
import { fetchItemListOverviewMaster } from "../../../redux/Inventory/Master/MasterAction";

const OverviewTable = ({ uuid }) => {
    const dispatch = useDispatch();
    const [visibleData, setVisibleData] = useState([]);
    const [itemsToShow, setItemsToShow] = useState(5);
    const tableData = useSelector((state) => state.inventoryMaster?.inventoryOverviewItems || []);
    useEffect(() => {
        if (uuid) {
            dispatch(fetchItemListOverviewMaster(uuid));
        }
    }, [uuid, dispatch]);

    useEffect(() => {
        // Only update visibleData when necessary
        if (tableData.length > 0 && visibleData.length !== itemsToShow) {
            setVisibleData(tableData.slice(0, itemsToShow));
        }
    }, [tableData, itemsToShow]);

    const handleViewAllClick = () => {
        setItemsToShow((prev) => prev + 5);
    };

    return (
        <div className="overflow-x-auto rounded-2xl darkBgCard">
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr style={{ backgroundColor: "var(--primary-color)", color: "white" }}>
                        <th className="py-3 px-6 text-left text-white">Item Name</th>
                        <th className="py-3 px-6 text-white text-center">Quantity</th>
                        {/* <th className="py-3 px-6 text-white text-center">Action</th> */}
                    </tr>
                </thead>
                <tbody>
                    {visibleData.length > 0 ? (
                        visibleData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-100 even:bg-gray-50 odd:bg-white">
                                <td className="py-3 px-2 border-b border-gray-200">{item.material_name}</td>
                                <td className="py-3 px-2 border-b border-gray-200 text-center">{item.quantity || 0}</td>
                                {/* <td className="py-3 px-2 border-b border-gray-200 text-center">
                                    <img src={actionIcon} alt="Action Icon" className="cursor-pointer" />
                                </td> */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="py-3 px-2 border-b border-gray-200 text-center text-sm">
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
                    View All <img src={arrowIcon} alt="Arrow Icon" className="ml-2" />
                </div>
            )}
        </div>
    );
};

export default OverviewTable;
