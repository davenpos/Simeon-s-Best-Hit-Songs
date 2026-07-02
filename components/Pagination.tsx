'use client';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Song list pagination"
      className="mt-4 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        className="rounded-full bg-lime-500 px-3 py-1 text-sm shadow-sm transition-all duration-300 hover:bg-lime-600 disabled:cursor-default disabled:opacity-60 cursor-pointer"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          disabled={disabled}
          aria-current={page === currentPage ? 'page' : undefined}
          className={`min-w-8 rounded-full px-2 py-1 text-sm shadow-sm transition-all duration-300 hover:bg-lime-600 disabled:cursor-default disabled:opacity-60 cursor-pointer ${
            page === currentPage ? 'bg-lime-300' : 'bg-lime-500'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        className="rounded-full bg-lime-500 px-3 py-1 text-sm shadow-sm transition-all duration-300 hover:bg-lime-600 disabled:cursor-default disabled:opacity-60 cursor-pointer"
      >
        Next
      </button>
    </nav>
  );
}
