import React from 'react'
import { convertToIST, TformatDateToYYYYMMDDWTime } from '../../utils/Date'

export default function StatusContainer({icon,time,content}) {
  return (
    <div className="info--box darkCardBg mt-5">
    <div className="content--box darkCardBg flex gap-2 items-center">
      <span className="top-clr">
        {icon}
      </span>
      <span className="no-wrap">
        <span className="font-bold pe-1 text-nowrap text-sm">{content}</span>
        <span className="text-nowrap text-sm">
          {time}
        </span>
      </span>
    </div>
  </div>  )
}
