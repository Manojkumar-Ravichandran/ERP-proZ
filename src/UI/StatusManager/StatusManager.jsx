// // import React from 'react';
// // import './StatusManager.css';
// // import { Tooltip as ReactTooltip } from "react-tooltip";

// // const StatusManager = ({ status, message, className, tooltipMessage, tooltipPosition = 'right', tooltipId }) => {
// //     // Use a mapping for classes based on status
// //     const statusClassMap = {
// //         info: 'status-blue',
// //         success: 'status-green',
// //         warning: 'status-yellow',
// //         error: 'status-red',
// //         inprogress: 'status-orange',
// //         normal: 'status-purple',
// //         hold: 'status-gray',
// //         blocked: 'status-pink',
// //         purple: 'status-purple',
// //         darkRed: 'status-darkred',
// //         darkOrange: 'status-darkorange',
// //         darkgreen: 'status-darkgreen',
// //         darkBlue: 'status-darkblue',
// //         darkpurple: 'status-darkpurple',
// //         darkpink: 'status-darkpink',
// //         lightgreen: 'status-lightgreen'
// //     };

// //     // Generate a unique tooltip id (you can pass an id as a prop or use some other unique identifier)

// //     return (
// //         <div>
// //             <div
// //                 className={`status-manager ${statusClassMap[status]} ${className}`}
// //                 data-tip={tooltipMessage}
// //                 data-for={tooltipId}  // Use the unique tooltip id
// //             >
// //                 {message}
// //             </div>
// //             <ReactTooltip id={tooltipId} place={tooltipPosition} />  {/* Use the same dynamic id */}
// //         </div>
// //     );
// // };

// // export default StatusManager;

// import React from 'react';
// import './StatusManager.css';
// import { Tooltip as ReactTooltip } from "react-tooltip";

// const StatusManager = ({ status, message, className, tooltipMessage, tooltipPosition = 'right', tooltipId }) => {
//     // Use a mapping for classes based on status
//     const statusClassMap = {
//         info: 'status-blue',
//         success: 'status-green',
//         warning: 'status-yellow',
//         error: 'status-red',
//         inprogress: 'status-orange',
//         normal: 'status-purple',
//         hold: 'status-gray',
//         blocked: 'status-pink',
//         purple: 'status-purple',
//         darkRed: 'status-darkred',
//         darkOrange: 'status-darkorange',
//         darkgreen: 'status-darkgreen',
//         darkBlue: 'status-darkblue',
//         darkpurple: 'status-darkpurple',
//         darkpink: 'status-darkpink',
//         lightgreen: 'status-lightgreen'
//     };

//     // Fallback message if no message is provided
//     const fallbackMessage = message || 'No status available';

//     return (
//         <div>
//             <div
//                 className={`status-manager ${statusClassMap[status]} ${className}`}
//                 data-tip={tooltipMessage || fallbackMessage}  // Use the provided tooltip or fallback to the message
//                 data-for={tooltipId}  // Unique tooltip id
//             >
//                 {fallbackMessage}
//             </div>
//             <ReactTooltip id={tooltipId} place={tooltipPosition} />
//         </div>
//     );
// };

// export default StatusManager;
import React from 'react';
import './StatusManager.css';
import { Tooltip as ReactTooltip } from "react-tooltip";

const StatusManager = ({ 
    status, 
    message, 
    className = '', 
    tooltipMessage, 
    tooltipPosition = 'right', 
    tooltipId 
}) => {
    // Define status class mappings
    const statusClassMap = {
        info: 'status-blue',
        success: 'status-green',
        warning: 'status-yellow',
        error: 'status-red',
        inprogress: 'status-orange',
        normal: 'status-purple',
        hold: 'status-gray',
        blocked: 'status-pink',
        purple: 'status-purple',
        darkRed: 'status-darkred',
        darkOrange: 'status-darkorange',
        darkgreen: 'status-darkgreen',
        darkBlue: 'status-darkblue',
        darkpurple: 'status-darkpurple',
        darkpink: 'status-darkpink',
        lightgreen: 'status-lightgreen'
    };

    // Fallback message handling
    const fallbackMessage = message || 'No status available';

    // Ensure a unique tooltip ID if not provided
    const uniqueTooltipId = tooltipId || `tooltip-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div>
            <div
                className={`status-manager capitalize ${statusClassMap[status] || 'status-default'} ${className}`}
                data-tip={tooltipMessage || fallbackMessage}  // Tooltip is optional
                data-for={uniqueTooltipId}  // Ensure tooltip ID is always available
            >
                {fallbackMessage}
            </div>
            {(tooltipMessage || fallbackMessage) && <ReactTooltip id={uniqueTooltipId} place={tooltipPosition} />}
        </div>
    );
};

export default StatusManager;
