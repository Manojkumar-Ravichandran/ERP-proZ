// // // import React from 'react';
// // // import StatusContainer from '../../../../UI/StatusContainer/StatusContainer';
// // // import icons from '../../../../contents/Icons';

// // // const Overview = () => {
// // //     const MetricsCard = ({ icon, value, title, stats }) => (
// // //         <div className="darkCardBg shadow-md rounded-2xl px-4 py-3 text-sm text-gray-800 w-full">
// // //             <div className="flex items-center mb-3">
// // //                 <div className="flex items-center justify-center w-12 h-12 mr-3 bg-gray-100 rounded-md border-l-4 border-green-500">
// // //                     <img src={icon} alt={title} className="w-5 h-5" />
// // //                 </div>
// // //                 <div>
// // //                     <h3 className="text-2xl font-bold">{value}</h3>
// // //                     <p className="text-gray-600 text-sm">{title}</p>
// // //                 </div>
// // //             </div>

// // //             <div className="flex flex-wrap gap-x-2 text-xs font-medium border-t pt-2">
// // //                 {stats.map(({ label, value, color, icon }, idx) => (
// // //                     <div key={idx} className="flex items-center gap-1">
// // //                         {icon && <img src={icon} alt="" className="w-3 h-3" />}
// // //                         {!icon && <span className={`w-2 h-2 rounded-full ${color}`} />}
// // //                         <span>{label}:</span>
// // //                         <span className="text-black">{value}</span>
// // //                         {idx !== stats.length - 1 && <span className="text-gray-300">|</span>}
// // //                     </div>
// // //                 ))}
// // //             </div>
// // //         </div>
// // //     );

// // //     return (
// // //         <>
// // //             <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
// // //                 <MetricsCard
// // //                     icon={icons?.projectIcon}
// // //                     value="3,00,000"
// // //                     title="Invoice Amount"
// // //                     stats={[
// // //                         { label: "Received", value: "2,50,000", icon: icons.tick },
// // //                         { label: "Due", value: "50,000", icon: "/icons/wallet.svg" },
// // //                     ]}
// // //                 />
// // //                 <MetricsCard
// // //                     icon="/icons/tasks.svg"
// // //                     value={20}
// // //                     title="Total Tasks Assigned"
// // //                     stats={[
// // //                         { label: "Completed", value: 10, color: "bg-green-600" },
// // //                         { label: "In Progress", value: 7, color: "bg-blue-600" },
// // //                         { label: "Pending", value: 3, color: "bg-yellow-500" },
// // //                     ]}
// // //                 />
// // //                 <MetricsCard
// // //                     icon="/icons/material.svg"
// // //                     value={40}
// // //                     title="Total Materials"
// // //                     stats={[
// // //                         { label: "Materials Spent", value: 35, color: "bg-green-600" },
// // //                         { label: "Materials remaining", value: 5, color: "bg-green-600" },
// // //                     ]}
// // //                 />
// // //             </section>

// // //             <StatusContainer
// // //                 icon={React.cloneElement(icons?.timeIcon, { size: 20 })}
// // //                 content="Lead Created On:"
// // //             // time={leadData?.data?.created_at}
// // //             />
// // //         </>
// // //     );
// // // };

// // // export default Overview;
// // import React from 'react';
// // import StatusContainer from '../../../../UI/StatusContainer/StatusContainer';
// // import icons from '../../../../contents/Icons';

// // const Overview = () => {
// //   const MetricsCard = ({ icon, value, title, stats }) => (
// //     <div className="darkCardBg shadow-md rounded-2xl px-4 py-3 text-sm text-gray-800 w-full">
// //       <div className="flex items-center mb-3">
// //         <div className="flex items-center justify-center w-12 h-12 mr-3 bg-gray-100 rounded-md border-l-4 ">
// //         <span className="top-clr">
// //         {icon}
// //       </span>        
// //       </div>
// //         <div>
// //           <h3 className="text-2xl font-bold">{value}</h3>
// //           <p className="text-gray-600 text-sm">{title}</p>
// //         </div>
// //       </div>

// //       <div className="flex flex-wrap gap-x-2 text-xs font-medium border-t pt-2">
// //         {stats.map(({ label, value, color, icon }, idx) => (
// //           <div key={idx} className="flex items-center gap-1">
// //             {icon && <span className="top-clr">
// //         {icon}
// //       </span>   }
// //             {!icon && <span className={`w-2 h-2 rounded-full ${color}`} />}
// //             <span>{label}:</span>
// //             <span className="text-black">{value}</span>
// //             {idx !== stats.length - 1 && <span className="text-gray-300">|</span>}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <>
// //       <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
// //       <MetricsCard
// //   icon={icons?.invoiceIcon}
// //   value="3,00,000"
// //   title="Invoice Amount"
// //   stats={[
// //     { label: 'Received', value: '2,50,000',  icon={icons?.invoiceIcon} },
// //     { label: 'Due', value: '50,000', icon: '/icons/wallet.svg' },
// //   ]}
// // />
// //         <MetricsCard
// //   icon={icons?.invoiceIcon}
// //   value={20}
// //           title="Total Tasks Assigned"
// //           stats={[
// //             { label: 'Completed', value: 10, color: 'bg-green-600' },
// //             { label: 'In Progress', value: 7, color: 'bg-blue-600' },
// //             { label: 'Pending', value: 3, color: 'bg-yellow-500' },
// //           ]}
// //         />
// //         <MetricsCard
// //           icon="/icons/material.svg"
// //           value={40}
// //           title="Total Materials"
// //           stats={[
// //             { label: 'Materials Spent', value: 35, color: 'bg-green-600' },
// //             { label: 'Materials remaining', value: 5, color: 'bg-green-600' },
// //           ]}
// //         />
// //       </section>

// //       <StatusContainer
// //         icon={React.cloneElement(icons?.timeIcon, { size: 20 })}
// //         content="Lead Created On:"
// //         // time={leadData?.data?.created_at}
// //       />
// //     </>
// //   );
// // };

// // export default Overview;
// import React, { useEffect, useState } from 'react';
// import StatusContainer from '../../../../UI/StatusContainer/StatusContainer';
// import icons from '../../../../contents/Icons';
// import { ProjectOverviewEffect } from '../../../../redux/project/ProjectEffects';

// const MetricsCard = ({ icon: Icon, value, title, stats }) => (
//   <div className="darkCardBg shadow-md rounded-2xl px-4 py-3 text-sm text-gray-800 w-full">
//     <div className="flex items-center mb-3">
//       <div className="flex items-center justify-center w-12 h-12 mr-3 bg-gray-100 rounded-md border-l-4 border-green-500">
//         {Icon && <Icon size={24} className="text-green-600" />}
//       </div>
//       <div>
//         <h3 className="text-2xl font-bold">{value}</h3>
//         <p className="text-gray-600 text-sm">{title}</p>
//       </div>
//     </div>

//     <div className="flex flex-wrap gap-x-2 text-xs font-medium border-t pt-2 ">
//       {stats.map(({ label, value, color, icon: StatIcon }, idx) => (
//         <div key={idx} className="flex items-center gap-1">
//           {StatIcon && <StatIcon size={12} className={`text-gray-700 ${color || ''}`} />}
//           {!StatIcon && <span className={`w-2 h-2 rounded-full ${color}`} />}
//           <span>{label}:</span>
//           <span className="text-black">{value}</span>
//           {idx !== stats.length - 1 && <span className="text-gray-300">|</span>}
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const Overview = ({projectDetails}) => {

//   const [metricsData, setMetricsData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch data from API
//   const fetchMetricsData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await ProjectOverviewEffect({project_uuid:projectDetails?.project_uuid}) // Replace with your API endpoint
//       setMetricsData(response.data);
//     } catch (err) {
//       console.error('Error fetching metrics data:', err);
//       setError('Failed to fetch metrics data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMetricsData();
//   }, []);
//   return (
//     <>
//       <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//         <MetricsCard
//           icon={icons?.invoiceIcon}
//           value="3,00,000"
//           title="Invoice Amount"
//           stats={[
//             { label: 'Received', value: '2,50,000', icon: icons?.receivedIcon, color: 'text-green-600' },
//             { label: 'Due', value: '50,000', icon: icons?.dueIcon, color: 'text-green-600' },
//           ]}
//         />

//         <MetricsCard
//           icon={icons?.taskIcon}
//           value={20}
//           title="Total Tasks Assigned"
//           stats={[
//             { label: 'Completed', value: 10, icon: icons.statusDot, color: 'text-green-600' },
//             { label: 'In Progress', value: 7, icon: icons.statusDot, color: 'text-blue-600' },
//             { label: 'Pending', value: 3, icon: icons.statusDot, color: 'text-yellow-500' },
//           ]}
//         />

//         <MetricsCard
//           icon={icons?.materialIcon}
//           value={20}
//           title="Total Materials"
//           stats={[
//             { label: 'Materials Spent', value: 35, color: 'bg-green-600' },
//             { label: 'Materials Remaining', value: 5, color: 'bg-green-600' },
//           ]}
//         />
//       </section>

//       <StatusContainer
//         icon={React.cloneElement(icons?.timeIcon, { size: 20 })}
//         content="Lead Created On:"
//         // time={leadData?.data?.created_at}
//       />
//     </>
//   );
// };

// export default Overview;
import React, { useEffect, useState } from 'react';
import StatusContainer from '../../../../UI/StatusContainer/StatusContainer';
import icons from '../../../../contents/Icons';
import { ProjectOverviewEffect } from '../../../../redux/project/ProjectEffects';
import Loader from '../../../../components/Loader/Loader';
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

const Overview = ({ projectDetails }) => {
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Fetch data from API
  const fetchMetricsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProjectOverviewEffect({ project_uuid: projectDetails?.project_uuid }); // Replace with your API endpoint
      console.log("response", response)
      if (response?.data?.status === 'success') {
        setMetricsData(response?.data?.data);
      }
    } catch (err) {
      console.error('Error fetching metrics data:', err);
      setError('Failed to fetch metrics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetricsData();
  }, []);
  console.log("projectDetails", metricsData)

  return (
    <div>
  {loading && <Loader />}
  {!loading && metricsData ? (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricsCard
          icon={icons?.invoiceIcon}
          value={metricsData.invoice_amount}
          title="Invoice Amount"
          stats={[
            { label: 'Received', value: metricsData.received_amount, icon: icons?.receivedIcon, color: 'text-green-600' },
            { label: 'Due', value: metricsData.due_amount, icon: icons?.dueIcon, color: 'text-red-600' },
          ]}
        />

        <MetricsCard
          icon={icons?.taskIcon}
          value={metricsData.total_task}
          title="Total Tasks Assigned"
          stats={[
            { label: 'Completed', value: metricsData.completed_task, icon: icons.statusDot, color: 'text-green-600' },
            { label: 'In Progress', value: metricsData.inprogress_task, icon: icons.statusDot, color: 'text-blue-600' },
            { label: 'Pending', value: metricsData.pending_task, icon: icons.statusDot, color: 'text-yellow-500' },
          ]}
        />

        <MetricsCard
          icon={icons?.materialIcon}
          value={metricsData.total_material}
          title="Total Materials"
          stats={[
            { label: 'Materials Spent', value: metricsData.spent_material, color: 'bg-green-600' },
            { label: 'Materials Remaining', value: metricsData.remaining_material, color: 'bg-yellow-600' },
          ]}
        />
      </section>
      <div className="mt-10">
        <StatusContainer
          className="mt-10"
          icon={React.cloneElement(icons?.timeIcon, { size: 20 })}
          content="Lead Created On:"
          time={metricsData.create_date}
        />
      </div>
      <div className="h-40"></div>
      <StatusContainer
        icon={React.cloneElement(icons?.timeIcon, { size: 20 })}
        content="Project completed On:"
        time={metricsData.complete_date}
      />
    </>
  ) : (
    !loading && <div></div>
  )}
</div>


  );
};

export default Overview;