// import React, { useCallback, useEffect, useState } from 'react'
// import ReadMore from '../../../../UI/ReadMore/ReadMore';
// import { customerOverviewEffect } from '../../../../redux/CRM/Customer/CustomerEffects';
// import { useSelector } from 'react-redux';
// import AlertNotification from '../../../../UI/AlertNotification/AlertNotification';
// import icons from '../../../../contents/Icons';
// import noOfInventory from "../../../../assets/img/noofinventory.svg";
// import Table from './Table';
// export default function OverView() {
//     const [overviewList, setoverviewList] = useState([]);
//     const [toastData, setToastData] = useState();

//     const customerDetails = useSelector(state => state?.customer?.customerDetail?.data);
//     useEffect(() => {
//         getoverviewList();
//     }, [customerDetails])

//     const getoverviewList = async () => {
//         const payload = {
//             uuid: customerDetails?.uuid
//         };
//         try {
//             const result = await customerOverviewEffect(payload);
//             

//             if (result?.data?.status === "success") {
//                 const overviews = result?.data?.data?.comm_history?.data;
//                 console.log("over", overviews)
//                 if (overviews.length > 0) {
//                     setoverviewList(overviews);
//                 } else {
//                     setoverviewList([]);
//                 }
//             } else {
//                 setoverviewList([]);
//             }
//         } catch (error) {
//             console.error("Error fetching overview data:", error);
//             setoverviewList([]);
//             setToastData({
//                 show: true,
//                 type: error?.data?.status,
//                 message: error?.data?.message,
//             });
//         }
//     };

//     const toastOnclose = useCallback(() => {
//         setToastData({ ...toastData, show: false });
//     }, [toastData]);
//     const headers = ['Lead ID', 'Lead Name', 'Address', 'Status']; 
//     return (
//         <>
//             {toastData?.show && (
//                 <AlertNotification
//                     type={toastData?.type}
//                     show={toastData?.show}
//                     message={toastData?.message}
//                     onClose={toastOnclose}
//                 />
//             )}
//             <div>
//                 <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8 '>
//                     <div className="darkCardBg shadow-md rounded-2xl py-3 pe-4 ">
//                         <div className='flex justify-between items-center'>
//                             <img src={noOfInventory} alt="leads" className="w-12 h-12 mr-4" />
//                            <div className='flex'>
//                             <p className=' '>won
//                                 <span>{result?.data?.data?.lead_won}</span>
//                             </p>
//                             <p>Progress
//                             <span>{result?.data?.data?.lead_progress}</span>
//                             </p>
//                            </div>
//                         </div>
//                         <div className='px-4'>
//                             <p className="font-semibold pt-3">Leads</p>
//                         </div>
//                     </div>
//                     {/* 2 */}
//                     <div className="darkCardBg shadow-md rounded-2xl py-3 pe-4 ">
//                         <div className='flex justify-between items-center'>
//                             <img src={noOfInventory} alt="leads" className="w-12 h-12 mr-4" />
//                             <h3 className="text-xl font-bold">Leads</h3>
//                         </div>
//                         <div className='px-4'>
//                             <p className="font-semibold pt-3">Leads</p>
//                         </div>
//                     </div>
//                     {/* 3 */}
//                     <div className="darkCardBg shadow-md rounded-2xl py-3 pe-4 ">
//                         <div className='flex justify-between items-center'>
//                             <img src={noOfInventory} alt="leads" className="w-12 h-12 mr-4" />
//                             <h3 className="text-xl font-bold">Leads</h3>
//                         </div>
//                         <div className='px-4'>
//                             <p className="font-semibold pt-3">Leads</p>
//                         </div>
//                     </div>
//                 </div>
//                 {overviewList?.length > 0 ? (
//                     <Table
//                         headers={headers}
//                         data={overviewList.map((overview) => [
//                             overview.lead_id, 
//                             overview.lead_name, 
//                             overview.address, 
//                             overview.status || 'N/A'  // Add any fallback for missing data
//                         ])}
//                         tableStyles={{ cardBg: 'bg-white', tableBorder: 'border-gray-400' }}
//                         headerStyles={{ fontWeight: 'bold' }}
//                         footerText="View All Products"
//                     />
//                 ) : (
//                     <p className="flex flex-col items-center">
//                         There are no overviews available.
//                     </p>
//                 )}
//             </div>

//         </>
//     )
// }

import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AlertNotification from '../../../../UI/AlertNotification/AlertNotification';
import noOfInventory from "../../../../assets/img/noofinventory.svg";
import Table from './Table';
import { customerOverviewEffect } from '../../../../redux/CRM/Customer/CustomerEffects';
import formatDateForDisplay from '../../../../UI/Date/DateDisplay';
export default function OverView() {
    const [overviewList, setOverviewList] = useState([]);
    const [leadWon, setLeadWon] = useState(0); // Store lead_won separately
    const [leadProgress, setLeadProgress] = useState(0); // Store lead_progress separately
    const [toastData, setToastData] = useState();

    const customerDetails = useSelector(state => state?.customer?.customerDetail?.data);

    useEffect(() => {
        getOverviewList();
    }, [customerDetails]);

    const getOverviewList = async () => {
        const payload = {
            uuid: customerDetails?.uuid
        };
        try {
            const result = await customerOverviewEffect(payload);
            

            if (result?.data?.status === "success") {
                const overviews = result?.data?.data?.comm_history?.data;
                setLeadWon(result?.data?.data?.lead_won); // Save lead_won to state
                setLeadProgress(result?.data?.data?.lead_progress); // Save lead_progress to state

                if (overviews.length > 0) {
                    setOverviewList(overviews);
                } else {
                    setOverviewList([]);
                }
            } else {
                setOverviewList([]);
            }
        } catch (error) {
            console.error("Error fetching overview data:", error);
            setOverviewList([]);
            setToastData({
                show: true,
                type: error?.data?.status,
                message: error?.data?.message,
            });
        }
    };

    const toastOnclose = useCallback(() => {
        setToastData({ ...toastData, show: false });
    }, [toastData]);

    const headers = ['Lead ID', 'Date', 'Status'];

    return (
        <>
            {toastData?.show && (
                <AlertNotification
                    type={toastData?.type}
                    show={toastData?.show}
                    message={toastData?.message}
                    onClose={toastOnclose}
                />
            )}
            <div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4'>
                    {/* Card 1 */}
                    <div className="darkCardBg shadow-md rounded-2xl py-3 pe-4">
                        <div className='flex justify-between items-center'>
                            <img src={noOfInventory} alt="leads" className="w-12 h-12 mr-4" />
                            <div className='flex gap-3'>
                                <p className='text-sm'>Won <br /><span className='font-semibold text-lg'>{leadWon}</span></p>
                                <p className='text-sm'>Progress <br /> <span className='font-semibold text-lg'>{leadProgress}</span></p>
                            </div>
                        </div>
                        <div className='px-4'>
                            <p className="font-semibold pt-3">Leads</p>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="darkCardBg shadow-md rounded-2xl py-3 pe-4">
                        <div className='flex justify-between items-center'>
                            <img src={noOfInventory} alt="leads" className="w-12 h-12 mr-4" />
                            <div className='flex gap-3'>
                                <p className='text-sm'>Total <br /><span className='font-semibold text-lg'>{leadWon}</span></p>
                                <p className='text-sm'>Progress <br /> <span className='font-semibold text-lg'>{leadProgress}</span></p>
                            </div>
                        </div>
                        <div className='px-4'>
                            <p className="font-semibold pt-3">Projects</p>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="darkCardBg shadow-md rounded-2xl py-3 pe-4">
                        <div className='flex justify-between items-center'>
                            <img src={noOfInventory} alt="leads" className="w-12 h-12 mr-4" />
                            <h3 className="text-lg font-bold">₹40,000.00</h3>
                        </div>
                        <div className='px-4'>
                            <p className="font-semibold pt-3">Pending Amount</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {overviewList?.length > 0 ? (
        <>
            <div>
                <p className='font-semibold text-lg py-2'>Communication List</p>
                <Table
                    headers={headers}
                    data={overviewList.map((overview) => [
                        overview.lead_id,
                        formatDateForDisplay(overview.last_followup),
                        overview.stage_name,
                    ])}
                    tableStyles={{ cardBg: 'bg-white', tableBorder: 'border-gray-400' }}
                    headerStyles={{ fontWeight: 'bold' }}
                />
            </div>
            <div>
            <p className='font-semibold text-lg py-2'>Payment List</p>

                <Table
                    headers={headers}
                    data={overviewList.map((overview) => [
                        overview.lead_id,
                        formatDateForDisplay(overview.last_followup),
                        overview.status || "₹50,000",
                    ])}
                    tableStyles={{ cardBg: 'bg-white', tableBorder: 'border-gray-400' }}
                    headerStyles={{ fontWeight: 'bold' }}
                />
            </div>
        </>
    ) : (
        <div className="col-span-1 lg:col-span-2">
            <p className="flex flex-col items-center">
                There are no overviews available.
            </p>
        </div>
    )}
</div>

            </div>
        </>
    );
}
