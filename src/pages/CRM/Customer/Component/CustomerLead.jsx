import React, { useState } from "react";
import icons from "../../../../contents/Icons";
import {
  padgeColorList,
  darkPadgeColorList,
} from "../../../../contents/Colors";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function CustomerLead({ leadDataList }) {
  const leadDatas = useSelector((state) => state?.customer?.customerDetail);
  const [lists, setLists] = useState(leadDataList?.data);
  const navigate = useNavigate();

  return (
    <>
      {leadDatas?.leadData?.data?.map((list) => (
        <div className="card" key={list?.id}>
          <div className="flex justify-between items-center">
            {/* <p className="top-clr font-semibold">{list?.lead_id}</p> */}

            <button
              className="text-blue underline top-clr font-semibold"
              onClick={() =>
                navigate(`/user/crm/lead/detail-lead/${list?.uuid}`, {
                  state: {
                    leadId: list?.lead_id,
                    is_customer: true,
                    uuid: leadDatas?.uuid,
                    lead_id:list?.lead_id,
                    leadDatas,
                  }, // Pass leadId in state
                })
              }
              title="View Lead Details"
            >
              {list?.lead_id}
            </button>
            {!list?.is_closed && (
              <>
                <span
                  className={`${padgeColorList?.orange} flex p-1 px-3 items-center rounded-full text-sm gap-1`}
                >
                  {React.cloneElement(icons?.timeIcon, { size: 16 })}
                  Pending
                </span>
              </>
            )}

            {list?.is_closed == 1 && list?.is_closed_type == "won" && (
              <>
                <span
                  className={`${padgeColorList?.green} flex p-1 px-3 items-center rounded-full text-sm gap-1`}
                >
                  {React.cloneElement(icons?.trophy, { size: 18 })}
                  Won
                </span>
              </>
            )}
            {list?.is_closed == 1 && list?.is_closed_type == "lost" && (
              <>
                <span
                  className={`${darkPadgeColorList?.red} flex p-1 px-3 items-center rounded-full text-sm gap-1`}
                >
                  {React.cloneElement(icons?.thumbDown, { size: 18 })}
                  Lost
                </span>
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
