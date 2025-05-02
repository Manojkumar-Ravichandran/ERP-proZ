// DropdownFilter.jsx
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { CiFilter } from 'react-icons/ci';

const DropdownFilter = forwardRef((props, ref) => {
    const { filterChangedCallback, options } = props; // Extract necessary props
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('All');

    // Toggle the dropdown menu
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Handle option selection
    const handleOptionSelect = (option) => {
        setSelectedOption(option.value);
        filterChangedCallback();
        setIsOpen(false);
    };

    // Reset the filter
    const handleReset = () => {
        setSelectedOption('All');
        filterChangedCallback();
        setIsOpen(false);
        
    };

    // AG Grid calls this method to know if the filter is active
    const isFilterActive = () => {
        const active = selectedOption !== 'All';
        
        return active;
    };

    // AG Grid calls this to check if a row passes the filter
    const doesFilterPass = (params) => {
        if (selectedOption === 'All') return true;
        return params.data[props.colDef.field] === selectedOption;
    };

    // AG Grid calls this to get the current filter state
    const getModel = () => {
        const model = selectedOption !== 'All' ? { value: selectedOption } : null;
        
        return model;
    };

    // AG Grid calls this to set the filter state
    const setModel = (model) => {
        if (model) {
            setSelectedOption(model.value);
            
        } else {
            setSelectedOption('All');
            
        }
    };

    // Expose the AG Grid filter interface methods
    useImperativeHandle(ref, () => ({
        isFilterActive,
        doesFilterPass,
        getModel,
        setModel,
    }));

    return (
        <div className="dropdown-filter" style={{ position: 'relative' }}>
            <button onClick={toggleDropdown} className="filter-button" style={{ display: 'flex', alignItems: 'center' }}>
                <CiFilter /> <span style={{ marginLeft: '5px' }}>Filter</span>
            </button>
            {isOpen && (
                <div className="dropdown-menu" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    zIndex: 1000,
                    width: '150px'
                }}>
                    {options.map(option => (
                        <div
                            key={option.value}
                            onClick={() => handleOptionSelect(option)}
                            className={`dropdown-option ${selectedOption === option.value ? 'selected' : ''}`}
                            style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                backgroundColor: selectedOption === option.value ? '#007bff' : 'white',
                                color: selectedOption === option.value ? 'white' : 'black'
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                    <div
                        onClick={handleReset}
                        className="dropdown-option"
                        style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            borderTop: '1px solid #ccc',
                            backgroundColor: '#f8f9fa'
                        }}
                    >
                        Reset
                    </div>
                </div>
            )}
        </div>
    );
});

export default DropdownFilter;
