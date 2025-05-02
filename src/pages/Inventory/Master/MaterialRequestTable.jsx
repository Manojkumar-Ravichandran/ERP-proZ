import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMaterialRequestEffect } from '../../../redux/Inventory/Master/MasterEffects';
import { convertDateTimeYMDToDMY } from '../../../utils/Date';
import StatusManager from '../../../UI/StatusManager/StatusManager';

export default function MaterialRequestTable({uuid}) {
    const dispatch = useDispatch();
    const [materialList, setMaterialList] = React.useState([]);
    const tableData = useSelector(
      (state) => state.inventoryMaster?.inventoryMaterialRequestItems || []
    );

    const fetchData = async (uuid) => {
        try {
            const response = await getMaterialRequestEffect({ uuid,fp_count:20});
            if(response?.data) {
                
                setMaterialList(response?.data?.data?.data);
            }
            // Handle the response if needed
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        if (uuid) {
            fetchData(uuid);
        }
    },[uuid]);
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
    <div>
        <div className="overflow-x-auto rounded-2xl darkBgCard">
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr style={{ backgroundColor: "var(--primary-color)", color: "white" }}>
                        <th className="py-3 px-6 text-left text-white">Request Id</th>
                        <th className="py-3 px-6 text-white text-center">Date</th>
                        <th className="py-3 px-6 text-white text-center">Status</th>
                        {/* <th className="py-3 px-6 text-white text-center">Action</th> */}
                    </tr>
                </thead>
                <tbody>
                    {materialList.length > 0 ? (
                        materialList.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-100 even:bg-gray-50 odd:bg-white">
                                <td className="py-3 px-2 border-b border-gray-200">{item.request_id}</td>
                                <td className="py-3 px-2 border-b border-gray-200 text-center">{convertDateTimeYMDToDMY(item?.date)}</td>
                                <td className="py-3 px-2 border-b border-gray-200 text-center">{item.status}</td>
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
            {/* {tableData.length > visibleData.length && (
                <div
                    className="flex justify-end items-center w-full border p-3 shadow-md cursor-pointer"
                    onClick={handleViewAllClick}
                >
                    View All <img src={arrowIcon} alt="Arrow Icon" className="ml-2" />
                </div>
            )} */}
        </div>
    </div>
  )
}
