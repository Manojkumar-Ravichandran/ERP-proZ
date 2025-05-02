import React from 'react';
import icons from '../../../contents/Icons';

export default function StatusIndicator({ color = "blue-500", size = 20, icon = true, content }) {
  // Check if the icon is valid
  console.log(icons?.dot);

  // Default icon if icons?.dot is not found
  const DefaultIcon = <div style={{ width: size, height: size, borderRadius: '50%', backgroundColor: 'blue' }}></div>;

  return (
    <div className="status-indicator flex items-center">
      <span className={color}>
        {icon && React.createElement(icons?.dot || DefaultIcon, { size })}
      </span>
      <span>{content}</span>
    </div>
  );
}
