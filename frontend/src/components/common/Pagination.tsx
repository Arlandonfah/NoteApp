import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 1;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages;

  const PageButton: React.FC<{
    page: number;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }> = ({ page, isActive = false, disabled = false, children }) => (
    <button
      onClick={() => !disabled && onPageChange(page)}
      disabled={disabled}
      className={`px-3 py-2 text-sm font-medium border transition-colors ${
        isActive
          ? "bg-blue-600 text-white border-blue-600"
          : disabled
          ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-center space-x-1">
      {/* First page button */}
      {showFirstLast && currentPage > 1 && (
        <PageButton page={1}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </PageButton>
      )}

      {/* Previous page button */}
      <PageButton page={currentPage - 1} disabled={currentPage === 1}>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </PageButton>

      {/* Start ellipsis */}
      {showStartEllipsis && (
        <>
          <PageButton page={1}>{1}</PageButton>
          <span className="px-2 py-2 text-gray-500">...</span>
        </>
      )}

      {/* Page numbers */}
      {visiblePages.map((page) => (
        <PageButton key={page} page={page} isActive={page === currentPage}>
          {page}
        </PageButton>
      ))}

      {/* End ellipsis */}
      {showEndEllipsis && (
        <>
          <span className="px-2 py-2 text-gray-500">...</span>
          <PageButton page={totalPages}>{totalPages}</PageButton>
        </>
      )}

      {/* Next page button */}
      <PageButton page={currentPage + 1} disabled={currentPage === totalPages}>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </PageButton>

      {/* Last page button */}
      {showFirstLast && currentPage < totalPages && (
        <PageButton page={totalPages}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </PageButton>
      )}
    </div>
  );
};

export default Pagination;
