// // import React, { useState } from "react";

// // const TaskPanel = () => {
// //     const [isOpen, setIsOpen] = useState(false);

// //     const togglePanel = () => setIsOpen(!isOpen);

// //     return (
// //         <div className="max-w-xl mx-auto">
// //             <div className="border border-gray-300 rounded-md shadow bg-white transition-all duration-300">
// //                 {/* Header */}
// //                 <button
// //                     onClick={togglePanel}
// //                     className="w-full flex justify-between items-center px-4 py-3 bg-white hover:bg-white"
// //                 >
// //                     <div className="text-left">
// //                         <p className="text-sm text-gray-500">28/03/2025</p>
// //                     </div>
// //                     <div className="flex items-center">
// //                         <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
// //                         <span className="text-sm text-blue-600">In Progress</span>
// //                     </div>
// //                 </button>

// //                 {/* Body */}
// //                 {isOpen && (
// //                     <div className="px-4 py-3 text-sm text-gray-700 border-t border-gray-200">
// //                         <p className="font-medium text-gray-800">Task Description</p>

// //                         <p className="mb-4 mx-2">
// //                             Fixed login page UI, improved dashboard responsiveness,
// //                             optimized database queries for faster performance, resolved
// //                             payment gateway bug, and completed checkout module testing.
// //                         </p>

// //                         <div>
// //                             <div className="w-full flex justify-between items-center">
// //                             <p className="font-medium text-gray-800 mb-2">Attachments</p>
// //                             <a href="#" className="ml-auto text-blue-600 hover:underline">⬇️ Download all</a>

// //                             </div>
// //                             <div className="flex flex-wrap gap-4 text-sm items-center">
// //                                 <a href="#" className="flex items-center gap-2 text-pink-600 hover:underline">
// //                                     📄 Design Brief.pdf <span className="text-gray-500 text-xs">(1.5 MB)</span>
// //                                 </a>
// //                                 <a href="#" className="flex items-center gap-2 text-yellow-600 hover:underline">
// //                                     🎨 Design logo.ai <span className="text-gray-500 text-xs">(4.5 MB)</span>
// //                                 </a>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default TaskPanel;

// import React, { useState } from "react";

// const TaskPanel = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const current = 20;
//     const total = 100;
//     const percentage = (current / total) * 100;
//     const radius = 18;
//     const stroke = 4;
//     const normalizedRadius = radius - stroke * 0.5;
//     const circumference = normalizedRadius * 2 * Math.PI;
//     const strokeDashoffset = circumference - (percentage / 100) * circumference;

//     const togglePanel = () => setIsOpen(!isOpen);

//     return (
//         <div className="max-w-xl mx-auto">
//             <div className="border border-gray-300 rounded-md shadow bg-white transition-all duration-300">
//                 {/* Header */}
//                 <button
//                     onClick={togglePanel}
//                     className="w-full flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50"
//                 >
//                     <div className="flex items-center gap-3">
//                         {/* Circular Progress */}
//                         <div className="relative w-10 h-10">
//                             <svg
//                                 height={radius * 2}
//                                 width={radius * 2}
//                                 className="transform -rotate-90"
//                             >
//                                 <circle
//                                     stroke="#E5EDFF"
//                                     fill="transparent"
//                                     strokeWidth={stroke}
//                                     r={normalizedRadius}
//                                     cx={radius}
//                                     cy={radius}
//                                 />
//                                 <circle
//                                     stroke="var(--primary-color)"
//                                      fill="transparent"
//                                     strokeWidth={stroke}
//                                     strokeDasharray={circumference + " " + circumference}
//                                     style={{ strokeDashoffset }}
//                                     r={normalizedRadius}
//                                     cx={radius}
//                                     cy={radius}
//                                 />
//                             </svg>
//                             <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-600 font-medium">
//                                 {String(current).padStart(2, "0")}
//                             </div>
//                         </div>

//                         {/* Title and Time */}
//                         <div className="text-left">
//                             <p className="text-sm text-gray-500">28/03/2025</p>
//                             {/* <p className="font-medium text-gray-800">Task Description</p> */}
//                         </div>
//                     </div>

//                     <div className="flex items-center">
//                         <span className="inline-block w-3 h-3 bg-[var(--primary-color)] rounded-full mr-2"></span>
//                         <span className="text-sm text-blue-600">In Progress</span>
//                     </div>
//                 </button>

//                 {/* Body */}
//                 {isOpen && (
//                     <div className="px-4 py-3 text-sm text-gray-700 border-t border-gray-200">
//                         <p className="mb-4">
//                             Fixed login page UI, improved dashboard responsiveness,
//                             optimized database queries for faster performance, resolved
//                             payment gateway bug, and completed checkout module testing.
//                         </p>

//                         <div>
//                             <div className="w-full flex justify-between items-center">
//                                 <p className="font-medium text-gray-800 mb-2">Attachments</p>                             <a href="#" className="ml-auto text-blue-600 hover:underline">⬇️ Download all</a>

//                             </div>
//                             <div className="flex flex-wrap gap-4 text-sm items-center">
//                                 <a href="#" className="flex items-center gap-2 text-pink-600 hover:underline">
//                                     📄 Design Brief.pdf <span className="text-gray-500 text-xs">(1.5 MB)</span>
//                                 </a>
//                                 <a href="#" className="flex items-center gap-2 text-yellow-600 hover:underline">
//                                     🎨 Design logo.ai <span className="text-gray-500 text-xs">(4.5 MB)</span>
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default TaskPanel;
import React, { useState } from "react";

const TaskPanel = ({ task }) => {
    console.log("task", task)
    const [isOpen, setIsOpen] = useState(false);

    const current = task.complete_value ?? 0;
    const total = 100;
    const percentage = (current / total) * 100;
    const radius = 18;
    const stroke = 4;
    const normalizedRadius = radius - stroke * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const togglePanel = () => setIsOpen(!isOpen);

    const statusMap = {
        1: "Not Started",
        3: "In Progress",
        4: "Completed",
    };

    const statusColorMap = {
        4: "bg-green-500",  // or bg-[var(--primary-color-1)]
        3: "bg-yellow-500", // or bg-[var(--primary-color-2)]
        1: "bg-red-500",    // or bg-[var(--primary-color-3)]
    };


    return (
        <div className="max-w-xl mx-auto">
            <div className="border border-gray-300 rounded-md shadow bg-white transition-all duration-300">
                {/* Header */}
                <button
                    onClick={togglePanel}
                    className="w-full flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50"
                >
                    <div className="flex items-center gap-3">
                        {/* Circular Progress */}
                        <div className="relative w-10 h-10">
                            <svg
                                height={radius * 2}
                                width={radius * 2}
                                className="transform -rotate-90"
                            >
                                <circle
                                    stroke="#E5EDFF"
                                    fill="transparent"
                                    strokeWidth={stroke}
                                    r={normalizedRadius}
                                    cx={radius}
                                    cy={radius}
                                />
                                <circle
                                    stroke="var(--primary-color)"
                                    fill="transparent"
                                    strokeWidth={stroke}
                                    strokeDasharray={`${circumference} ${circumference}`}
                                    strokeDashoffset={strokeDashoffset}
                                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                                    r={normalizedRadius}
                                    cx={radius}
                                    cy={radius}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-600 font-medium">
                                {String(current).padStart(2, "0")}
                            </div>
                        </div>

                        {/* Date and Employees */}
                        <div className="text-left">
                            <p className="text-sm text-gray-500">{task.date}</p>
                            {/* <p className="text-xs text-gray-700">
                                👷‍♂️ {task.worker_name?.join(", ") || "Unassigned"}
                            </p> */}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${statusColorMap[task.status] || "bg-gray-400"}`}
                        ></span>
                        <span className="text-sm text-bg-[var(--primary-color)]">{statusMap[task.status] || "Unknown"}</span>
                    </div>
                </button>

                {/* Body */}
                {isOpen && (
                    <div className="px-4 py-3 text-sm text-gray-700 border-t border-gray-200">
                        <h2 className="text-sm font-semibold mb-2">Work Assigned</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-4">
                            {task.worker_name?.map((worker, index) => (
                                <p key={index} className="text-xs text-gray-700">
                                    {index + 1}. 👷‍♂️ {worker}
                                </p>
                            )) || (
                                    <p className="text-xs text-gray-700">Unassigned</p>
                                )}
                        </div>
                        <h2 className="text-sm font-semibold mb-2">Notes</h2>
                        <p className="mb-3 px-4">
                            {task.notes || "No additional notes provided for this task."}
                        </p>

                        {task.attachment && (
                            <div>
                                <div className="w-full flex justify-between items-center">
                                    <p className="font-medium  text-gray-800 mb-2">Attachments</p>
                                    <a
                                        href={task.attachment}
                                        className="ml-auto text-blue-600 hover:underline cursor-pointer"
                                        download
                                    >
                                        ⬇️ Download
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskPanel;
