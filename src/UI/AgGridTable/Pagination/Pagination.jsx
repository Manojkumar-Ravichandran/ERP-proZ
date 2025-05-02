import React from 'react';
import './Pagination.css';
import icons from "../../../contents/Icons";

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    onPageSizeChange,
    startItem,
    endItem,
    totalItems
}) => {
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
    
        // First 3 pages
        for (let i = 1; i <= Math.min(3, totalPages); i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`page-btn ${currentPage === i ? 'active' : ''}`}
                >
                    {i}
                </button>
            );
        }
    
        // Ellipsis if there are pages between the first 3 and the last 3
        if (totalPages > 6 && currentPage > 4) {
            pages.push(<span key="ellipsis1" className="ellipsis">...</span>);
        }
    
        // Pages around the current page
        if (currentPage > 3 && currentPage < totalPages - 2) {
            pages.push(
                <button
                    key={currentPage}
                    onClick={() => handlePageChange(currentPage)}
                    className={`page-btn active`}
                >
                    {currentPage}
                </button>
            );
        }
    
        // Ellipsis before the last 3 pages
        if (totalPages > 6 && currentPage < totalPages - 3) {
            pages.push(<span key="ellipsis2" className="ellipsis">...</span>);
        }
    
        // Last 3 pages
        for (let i = Math.max(totalPages - 2, 4); i <= totalPages; i++) {
            if (i > 3) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`page-btn ${currentPage === i ? 'active' : ''}`}
                    >
                        {i}
                    </button>
                );
            }
        }
    
        return pages;
    };

    return (
        <div className="pagination darkCardBg">
            <div>
                <p>
                    Showing <span className='font-bold'>{startItem}</span> - <span className='font-bold'>{endItem}</span> of <span className='font-bold'>{totalItems}</span> items
                </p>
            </div>
            <div className="flex gap-3 items-center">
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                >
                    <span className='icon'>{icons.MdOutlineSkipPrevious}</span>
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <span className='icon'>{icons.GrFormPrevious}</span>
                </button>

                {renderPageNumbers()}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <span className='icon'>{icons.MdNavigateNext}</span>
                </button>
                <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    <span className='icon'>{icons.MdOutlineSkipNext}</span>
                </button>
            </div>
        </div>
    );
};

export default Pagination;