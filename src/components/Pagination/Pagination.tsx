import React from 'react';

import './Pagination.css';

type PaginationProps = {
    currentPage: number;
    totalRecords: number;
    recordsPerPage: number;
    onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalRecords, recordsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    };

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={currentPage === i ? 'active' : ''}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="pagination">
            <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                Previous
            </button>
            {renderPageNumbers()}
            <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
