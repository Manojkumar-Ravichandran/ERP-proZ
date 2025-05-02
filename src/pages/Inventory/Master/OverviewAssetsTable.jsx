
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import action from "../../../assets/img/actionediticon.svg";
import arrowicon from "../../../assets/img/arrowicon.svg"
import { fetchAssetsListOverviewMaster } from '../../../redux/Inventory/Master/MasterAction';
const OverviewAssetsTable = ({ uuid }) => {
    const dispatch = useDispatch();
    const [visibleData, setVisibleData] = useState([]);
    const [itemsToShow, setItemsToShow] = useState(5);
    const tableData = useSelector((state) => state.inventoryMaster?.inventoryOverviewAssets || []);
    useEffect(() => {
        if (uuid) {
            dispatch(fetchAssetsListOverviewMaster(uuid));
        }
    }, [uuid, dispatch]);

    useEffect(() => {
        if (tableData.length > 0 && visibleData.length !== itemsToShow) {
            setVisibleData(tableData.slice(0, itemsToShow));
        }
    }, [tableData, itemsToShow]);

    const handleViewAllClick = () => {
        setItemsToShow((prev) => prev + 5);
    };


    return (
        <div className="overflow-x-auto rounded-2xl darkBgCard">
            <table className="min-w-full border-collapse border border-gray-200 ">
                <thead>
                    <tr style={{
                        backgroundColor: 'var(--primary-color)', color: "white"
                    }}>
                        <th className="py-3 px-6 text-left text-white">Assets Name</th>
                        <th className="py-3 px-6  text-white text-center">Quantity</th>
                        <th className="py-3 px-6 text-left text-white">Assets Type</th>
                        <th className="py-3 px-6 text-left text-white">Date</th>
                        <th className="py-3 px-6 text-left text-white">Expiry Date</th>
                        <th className="py-3 px-6 text-white text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleData.length > 0 ? (
                        visibleData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-100 even:bg-gray-50 odd:bg-white">
                                <td className="py-3 px-2 border-b border-gray-200">{item.item}</td>
                                <td className="py-3 px-2 border-b border-gray-200  text-center">{item.quantity}</td>
                                <td className="py-3 px-2 border-b border-gray-200  text-center">{item.assetstype}</td>
                                <td className="py-3 px-2 border-b border-gray-200  text-center">{item.date}</td>
                                <td className="py-3 px-2 border-b border-gray-200  text-center">{item.expiry}</td>

                                <td className="py-3 px-2 border-b border-gray-200 text-sm flex text-center justify-center"><img src={item.category} alt="" /></td>
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

export default OverviewAssetsTable;

