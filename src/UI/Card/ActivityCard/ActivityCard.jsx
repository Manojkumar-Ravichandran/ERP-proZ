import React from "react";
import icons from "../../../contents/Icons"; // Replace with your icons file
import './ActivtiyCard.css'

const activities = [
  {
    id: 1,
    icon: icons.filepin,
    title: "Quotation",
    description: "Customer is interested...",
    file: "file.pdf",
    date: "2 hours ago",
    meta: "by: Lora Adams",
    group: "This Week",
  },
  {
    id: 2,
    icon: icons.whatsappIcon,
    title: "WhatsApp",
    description: "webinar-email-follow-up",
    date: "14-11-2024",
    meta: "by: John Lock",
    group: "This Week",
  },
  {
    id: 3,
    icon: icons.mail,
    title: "Mail",
    description: "Discuss delivery timelines...",
    date: "14-11-2024",
    meta: "by: Jane Smith",
    group: "Last Week",
  },
  {
    id: 4,
    icon: icons.call,
    title: "Call",
    description: "shopify:plugin-configuration-setup",
    date: "13-12-2024",
    meta: "by: John Lock",
    group: "Last Week",
  },
];

export default function Timeline() {
  // Group activities by `group`
  const groupedActivities = activities.reduce((acc, activity) => {
    if (!acc[activity.group]) {
      acc[activity.group] = [];
    }
    acc[activity.group].push(activity);
    return acc;
  }, {});

  return (
    <>
    {/* <div className="flex justify-end p-0 m-0">
    <button className="text-xl  rounded-full bg-primary-40 me-2 w-10 h-10">+</button>
    <button className="text-xl rounded-full bg-primary-40 w-10 h-10">+</button>
  </div> */}
    <div className="timeline space-y-8">
      {Object.entries(groupedActivities).map(([group, activities]) => (
        <div key={group}>
          {/* Group Header */}
          <h2 className="text-lg font-semibold text-primary-800 mb-4">{group}</h2>
          {/* Activities */}
          <div className="relative">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex items-start gap-4 relative">
                {/* Vertical Line */}
                {index !== activities.length - 1 && (
                  <div className="absolute left-9 top-10 h-full w-px bg-gray-300 z-0 line"></div>
                )}

                {/* Date and Icon */}
                <div className="flex flex-col items-center z-10">
                  <span className="text-sm text-gray-500 w-20"></span>
                  <div className="w-10 h-10 flex items-center justify-center bg-primary-10 text-primary-900 rounded-full mt-2 relative z-10">
                    {activity.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="grow darkCardBg mt-2 p-2 rounded-md shadow-md border flex gap-2 z-0">
                  <div className="flex flex-col items-center justify-center border-r px-2">
                    {/* <span className="text-2xl block font-semibold text-black-500">2</span>
                    <span className="text-xs text-black-500">Hours Ago</span> */}
                    <span className="text-2xl block font-semibold text-primary-500">02</span>
                    <span className="text-xs text-black-500">Jun</span>
                  {/* {activity.date} */}
                  </div>
                  <div>
                  <h3 className="text-lg flex font-semibold mb-1 items-center">
                    {activity.title}
                    {activity.file && (
                      <span className="flex text-sm text-blue underline font-normal items-center ml-2">
                        {icons.filepin} {activity.file}
                      </span>
                    )}
                  </h3>
                  {activity.description && (
                    <p className="text-blue-500 text-base cursor-pointer">
                      {activity.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 ">{activity.meta}</p>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
    </>
  );
}



// import React from "react";
// import icons from "../../../contents/Icons";
// import InfoWithIcon from "../../Text/InfoWithIcon/InfoWithIcon";

// export default function ActivityCard({ linkText }) {
//   return (
//     <>
//       <div className="darkCardBg mb-3 rounded-md p-3 border">
//         <div className="flex gap-3">
//           <div className="grow">
//               <div className="grid">
//               <div className="title font-medium text-lg flex">Quotation
//               <span className="text-blue underline cursor-pointer text-sm flex items-center ms-2">
//                     {icons.filepin} {linkText || "file.pdf"}
//                   </span>
//               </div>
//                 <span className="text-sm">
//                   Customer is interested in long-lasting options.
//                 </span>
//                 <label>{icons?.profileIcon} By:Jhon</label>
//             </div>
//           </div>
//         </div>
//       </div>
      
//     </>
//   );
// }



{/* <div className="border mb-3 rounded-md p-3 bg-gray-50">
        <div className="flex gap-3">
          <div className="feildvisit text-center rounded-full p-3 w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-500">
            {icons?.call}
          </div>
          <div className="grow">
            <div className="grid grid-cols-4 items-center justify-between mb-2">
              <div className="flex gap-1">
                <span className="title font-semibold text-lg">Enquiry</span>
                {
                  //   linkText &&
                  <span className="text-blue underline cursor-pointer text-sm flex items-center ms-2">
                    {icons.filepin} {linkText || "View"}
                  </span>
                }
              </div>
              <div className="flex gap-1 items-center">
                {icons?.profileIcon}
                {"Jhon"}
              </div>
              <div className="flex justify-end col-start-3 col-end-5">
                <InfoWithIcon
                  icon={React.cloneElement(icons?.calendarWDate, { size: 20 })}
                  label="Schedule on"
                  text="1 Sep 2024, 12:30 AM"
                />
              </div>
            </div>
            <div>
              <div className="flex gap-2 mb-2">
                <span className="flex items-center gap-1 text-sm font-semibold">
                  {React.cloneElement(icons.feedbackIcon, { size: 20 })}{" "}
                  Customer Query:
                </span>
                <span className="text-sm">
                  What is the average lifespan of an asphalt shingle roof
                </span>
              </div>
              <div className="flex gap-2 mb-2">
                <span className="flex items-center gap-1 text-sm font-semibold">
                  {React.cloneElement(icons.answerIcon, { size: 20 })} Replay:
                </span>
                <span className="text-sm">
                  The average lifespan of an asphalt shingle roof is typically
                  20-30 years, depending on the quality of materials and
                  maintenance.{" "}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-sm font-semibold">
                  {React.cloneElement(icons.GoNote, { size: 20 })} Notes:
                </span>
                <span className="text-sm">
                  Customer is interested in long-lasting options.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div> */}