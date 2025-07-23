import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import "./CustomPaginator.css";

interface CustomPaginatorProps {
  currentPage: number;
  totalItems: number;
  limit: number;
  onPageChange: (params: { page: number }) => void;
  onLimitChange?: (newLimit: number) => void;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  maxVisiblePages?: number;
  className?: string;
}

const CustomPaginator: React.FC<CustomPaginatorProps> = ({
  currentPage,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
  showPageSizeSelector = true,
  pageSizeOptions = [10, 20, 50, 100],
  maxVisiblePages = 5,
  className = "",
}) => {
  const totalPages = Math.ceil(totalItems / limit);

  // Calculate visible pages
  const getVisiblePages = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange({ page });
    }
  };

  const handleLimitChange = (newLimit: number) => {
    if (onLimitChange) {
      onLimitChange(newLimit);
    }
  };

  if (totalPages <= 1 && !showPageSizeSelector) {
    return null;
  }

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className={`custom-paginator ${className}`}>
      <div className="info">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          title="First page"
          className="page-btn"
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous page"
          className="page-btn"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="page-numbers">
          {visiblePages[0] > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="page-number"
              >
                1
              </button>
              {visiblePages[0] > 2 && <span className="ellipsis">...</span>}
            </>
          )}

          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`page-number ${page === currentPage ? "active" : ""}`}
            >
              {page}
            </button>
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <span className="ellipsis">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="page-number"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next page"
          className="page-btn"
        >
          <ChevronRight size={16} />
        </button>

        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Last page"
          className="page-btn"
        >
          <ChevronsRight size={16} />
        </button>
      </div>

      {showPageSizeSelector && (
        <div className="page-size-selector">
          <label htmlFor="pageSize">Show:</label>
          <select
            id="pageSize"
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>per page</span>
        </div>
      )}
    </div>
  );
};

export default CustomPaginator;
