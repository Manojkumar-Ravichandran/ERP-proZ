import React, { useEffect } from 'react';
import action from "../../../assets/img/actionediticon.svg"
import { getTransactionEffect } from '../../../redux/Inventory/Master/MasterEffects';
const OverviewTransactionsTable = ({uuid}) => {
    const [materialList, setMaterialList] = React.useState([]);
    

    const fetchData = async (uuid) => {
        try {
            const response = await getTransactionEffect({ uuid});
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
    const inventoryData = [
        { id: 1, item: 'Item name ', quantity: 50, category: action, date: "20-11-2024", in: "in", out: "out", type: "Type" },
        { id: 2, item: 'Item name', quantity: 30, category: action, date: "30-11-2024", in: "in", out: "out", type: "Type" },
        { id: 3, item: 'Item name', quantity: 20, category: action, date: "21-11-2024", in: "in", out: "out", type: "Type" },
        { id: 4, item: 'Item name', quantity: 15, category: action, date: "11-11-2024", in: "in", out: "out", type: "Type" },
    ];

    return (
      <div className="overflow-x-auto rounded-2xl darkBgCard">
        <table className="min-w-full border-collapse border border-gray-200 ">
          <thead>
            <tr
              style={{
                backgroundColor: "var(--primary-color)",
                color: "white",
              }}
            >
              {" "}
              <th className="py-3 px-6 text-left text-white">Date</th>
              <th className="py-3 px-6 text-left text-white">Transfer From</th>
              <th className="py-3 px-6 text-white text-center">Transfer To</th>
              <th className="py-3 px-6 text-white text-center"> Transfer By</th>
              <th className="py-3 px-6 text-white text-center"> Vehicle Number</th>
              
            </tr>
          </thead>
          <tbody>
           {materialList?.length>0 &&<>
            {materialList.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-100 even:bg-gray-50 odd:bg-white"
              >
                <td className="py-3 px-2 border-b border-gray-200">
                  {item.date}
                </td>
                <td className="py-3 px-2 border-b border-gray-200">
                  {item.trans_from_name}
                </td>
                <td className="py-3 px-2 border-b border-gray-200  text-center">
                  {item.trans_to_name}
                </td>
                <td className="py-3 px-2 border-b border-gray-200  text-center">
                  {item.trans_by_name}
                </td>
                <td className="py-3 px-2 border-b border-gray-200  text-center">
                  {item.vehicle_no}
                </td>
                
              </tr>
            ))}
            </>}
            {materialList?.length>0 &&<>
            <tr>
            <td colSpan="5" className="py-3 px-2 border-b border-gray-200 text-center text-sm">
                    No items available.
                </td>
            </tr>
            </>}

                
          </tbody>
        </table>
        {/* <div className="flex justify-items-end justify-end w-full border p-3 shadow-md">
                View All
            </div> */}
      </div>
    );
};

export default OverviewTransactionsTable;

