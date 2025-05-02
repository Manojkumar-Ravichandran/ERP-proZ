import React from 'react';
import './Pagination.css';
import icons from "../../../contents/Icons";

const PaginationSmall = ({
    currentPage,
    totalPages,
    onPageChange,
    className
}) => {
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="p-2 px-4 darkCardBg rounded-md">
            <div className={`flex items-center gap-1 ${className}`}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}>
                    <span className='icon'>{icons.GrFormPrevious}</span>
                </button>
                <div>
                 <span>pages</span>   <span className='font-bold'> {currentPage} </span> of <span className='font-bold'> {totalPages}</span>
                </div>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}>
                    <span className='icon'>{icons.MdNavigateNext}</span>
                </button>

            </div>
        </div>
    );
};

export default PaginationSmall;
