import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getLeadNotesListEffect } from "../../../../redux/CRM/lead/LeadEffects";
import icons from "../../../../contents/Icons";
import { padgeColorList } from "../../../../contents/Colors";
import { DBtimeConvert } from "../../../../utils/Date";
import { images } from "../../../../contents/Images";
import ReadMore from "../../../../UI/ReadMore/ReadMore"
export default function LeadNotes({ uuid }) {
  const [notesList, setNotesList] = useState([]);


  useEffect(() => {
    if (uuid) {
      (async () => {
        const payload = { uuid };
        const { data } = await getLeadNotesListEffect({ ...payload });
        setNotesList(data.data);
      })();
    }
  }, []);
  return (
    <>
      {notesList.length > 0 && (
        <>
          {notesList.map((note) => (
              <div className="" key={note?.uuid}>
              <div className="flex items-center gap-2 py-2" key={note.id}>
                <div className="grid justify-items-center w-20">
                  <span className="icon-top-clr p-2 inline-block rounded-full border-0">
                    {note?.mode_communication_name
                      ? React.cloneElement(
                        icons[note?.mode_communication_name.toLowerCase()],
                        { size: 20 }
                      )
                      : React.cloneElement(icons["note"], { size: 20 })}
                  </span>
                  <span className="font-semibold text-xs pt-2">
                    {(() => {
                      const date = new Date(note?.created_at);
                      const day = String(date.getDate()).padStart(2, '0');
                      const month = date.toLocaleString('en-US', { month: 'short' });
                      const year = String(date.getFullYear()).slice(-2);
                      return `${day} ${month} ${year}`;
                    })()}
                  </span>
                </div>

                <div className="activity__card grow darkCardBg mt-2 rounded-lg border gap-2 z-0 w-full">
                  <div className="flex">
                    <div className="grow w-full">
                      <div className="pb-3">
                        <ReadMore className="font-normal px-4 pt-3 text-sm" maxWords={23} text={note?.description} />
                      </div>
                      <div className="flex justify-between bg-gray-100 p-2 rounded-b-md ">
                        <div className="flex gap-2">
                          <span className="flex items-center gap-2">
                            <span className="top-clr"> {icons.employeeIcon}</span> <span className='text-sm'>{note?.created_by || "Admin"}</span> </span>
                        </div>
                        <div>
                          <span className="flex items-center gap-2">
                            <span className="top-clr">{icons.timeIcon}</span>
                            <span className='text-sm'>
                            {(() => {
                              const date = new Date(note?.created_at);
                              const time = date.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              });
                              return time;
                            })()}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div >
            </div>
          ))}
        </>
      )}

      {notesList.length == 0 && (
        <p className="flex flex-col items-center ">
                  {/* <img src={images?.noData} alt ="No Upcoming Activities Scheduled"  className="w-20"/> */}

          There are no notes available.
          </p>
      )}
    </>
  );
}

//  <div className="flex gap-3 items-center mb-4  notes__card leading-6" key={note?.uuid}>
//                 <span
//                   className={`${padgeColorList.orange} rounded-full p-2 border-0`}
//                 >
//                   {React.cloneElement(icons?.note, { size: 20 })}
//                 </span>

//                 <div className="notes__content grow p-2  ">
//                     <p>
//                         {note?.description}
//                     </p>
//                     <p className="text-gray-800 text-sm mb-1">
//                         <span>
//                             {DBtimeConvert(note?.created_at)}
//                         </span>
//                         <span className="ms-1">
//                             By {note?.created_by}
//                         </span>
//                     </p>

//                 </div>
//               </div>  