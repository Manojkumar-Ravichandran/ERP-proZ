// import React from 'react';

// const ProgressBar = ({ percentage = 0 }) => {
//   const getColor = (percent) => {
//     if (percent <= 10) return 'bg-red-500';
//     if (percent <= 50) return 'bg-yellow-400';
//     return 'bg-green-500';
//   };

//   return (
//     <div className="w-full  px-2 flex items-center justify-center space-x-1 ">
//     <div className="text-xs font-light">{percentage}%</div>
//     <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
//       <div
//         className={`h-full rounded-full ${getColor(percentage)} transition-all duration-300 ease-in-out`}
//         style={{ width: `${percentage}%` }}
//       />
//     </div>
//   </div>
  
//   );
// };

// export default ProgressBar;
import React from 'react';

const ProgressBar = ({ percentage = 0 }) => {
  const getColor = (percent) => {
    if (percent <= 10) return 'text-red-500 bg-red-500';
    if (percent <= 50) return 'text-yellow-400 bg-yellow-400';
    return 'text-green-500 bg-green-500';
  };

  return (
    <div className="w-full px-2 flex items-center justify-center space-x-1">
      <div className={`text-xs font-light ${getColor(percentage).split(' ')[0]}`}>
        {percentage}%
      </div>
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full ${getColor(percentage).split(' ')[1]} transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;