import React from 'react'

export default function ViewHeadingContainer({title, editIcon,className}) {
  return (
    <div className={`flex justify-between mt-3  py-2 ${className}`}>
        <p className='text-xl font-semibold'>{title}</p>
        {editIcon&&editIcon}
    </div>
  )
}
