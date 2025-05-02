import React, { useEffect, useState } from 'react'
import { customerCommunicationEffect } from '../../../../redux/CRM/Customer/CustomerEffects';
import ReadMore from '../../../../UI/ReadMore/ReadMore';
import icons from '../../../../contents/Icons';

export default function CommunicationTab({leadDatList}) {
    
    const [communicationList, setCommunicationList]= useState()

    useEffect(()=>{
        if(leadDatList){
            
            getCommunication()
        }
    },[leadDatList]);
    const getCommunication =async()=>{
        const payload ={
            uuid:leadDatList?.uuid
        }

        try{
            const {data} = await customerCommunicationEffect(payload);
            setCommunicationList(data?.data)
            console.log(data)
                
        }catch(err){

        }
    }
  return (
    <div>
        {communicationList?.map((note) => (
              <div className="" key={note?.uuid}>
              <div className="flex items-center gap-2 py-2" key={note.id}>
                <div className="grid justify-items-center w-20">
                  <span className="icon-top-clr p-2 inline-block rounded-full border-0">
                    {note?.type_name
                      ? React.cloneElement(
                        icons[note?.type_name.toLowerCase()],
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
                        <ReadMore className="font-normal px-4 pt-3 text-sm" maxWords={23} text={note?.content} />
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
    </div>
  )
}
