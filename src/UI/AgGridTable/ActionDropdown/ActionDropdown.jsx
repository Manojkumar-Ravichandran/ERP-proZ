import React, { useState, useEffect, useRef } from 'react';
import './ActionDropdown.css';
import icons from '../../../contents/Icons';

export default function ActionDropdown({ options = [], onAction, icon,
    iconClass = '', }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null); // Ref to track the dropdown menu

    const handleToggleDropdown = (event) => {
        event.stopPropagation(); // Stop event propagation
        setIsOpen(prevState => !prevState);
    };

    const handleOptionClick = (event, action) => {
        event.stopPropagation(); // Stop event propagation
        onAction(action);
        setIsOpen(false); // Close dropdown after action
    };

    // Effect to handle click outside the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false); // Close dropdown
            }
        };

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="dropdown-menu-container" ref={dropdownRef}>
            <button onClick={handleToggleDropdown} className="dropdown-button">
                <div className="flex gap-1 items-center justify-center ">

                    <span className={iconClass}>

                        {icon ? React.cloneElement(icon, { size: 11 }) : icons.more}

                        {/* Use provided icon or default to icons.more */}
                    </span>
                </div>
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    <ul className="options-list">
                        {options.map((option, index) => (
                            <li
                                key={index}
                                onClick={(event) => handleOptionClick(event, option.action)}
                                className="option flex items-center gap-2"
                            >
                                {option.icon && (
                                    <span className={option.iconClass}>
                                        {React.cloneElement(option.icon, { size: 12 })}
                                    </span>
                                )}
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>

            )}
        </div>
    );
}
