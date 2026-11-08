'use client';

function PaginationButton({
  onClick,
  disabled,
  className,
  text,
  ariaCurrent,
}: {
  onClick: () => void;
  disabled: boolean;
  className: string;
  text: string;
  ariaCurrent?: boolean | 'page' | 'false' | 'true' | 'step' | 'location' | 'date' | 'time';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={ariaCurrent}
      className={`rounded-full py-1 text-sm shadow-sm transition-all duration-300 hover:not-disabled:bg-lime-600 disabled:cursor-default disabled:opacity-60 cursor-pointer ${className}`}
    >
      {text}
    </button>
  );
}

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
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        className="bg-lime-500 px-3"
        text="Previous"
      />

      {totalPages <= 9 ? (
        <>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <PaginationButton
              key={page}
              onClick={() => onPageChange(page)}
              disabled={disabled}
              className={`min-w-8 px-2 ${page === currentPage ? 'bg-lime-300' : 'bg-lime-500'}`}
              text={String(page)}
              ariaCurrent={page === currentPage ? 'page' : undefined}
            />
          ))}
        </>
      ) : (
        <>
          {Array.from(
            { length: currentPage <= 6 ? currentPage + 2 : 3 },
            (_, index) => index + 1,
          ).map((page) => (
            <PaginationButton
              onClick={() => onPageChange(page)}
              disabled={disabled}
              className={`min-w-8 px-2 ${page === currentPage ? 'bg-lime-300' : 'bg-lime-500'}`}
              text={String(page)}
              ariaCurrent={page === currentPage ? 'page' : undefined}
            />
          ))}

          {currentPage - 3 > 3 && (
            <div className="rounded-full py-1 text-sm shadow-sm transition-all duration-300 bg-lime-500 px-2">
              ...
            </div>
          )}

          {currentPage - 3 > 3 &&
            currentPage + 3 < totalPages - 2 &&
            Array.from({ length: 5 }, (_, index) => index + currentPage - 2).map((page) => (
              <PaginationButton
                key={page}
                onClick={() => onPageChange(page)}
                disabled={disabled}
                className={`min-w-8 px-2 ${page === currentPage ? 'bg-lime-300' : 'bg-lime-500'}`}
                text={String(page)}
                ariaCurrent={page === currentPage ? 'page' : undefined}
              />
            ))}

          {currentPage + 3 < totalPages - 2 && (
            <div className="rounded-full py-1 text-sm shadow-sm transition-all duration-300 bg-lime-500 px-2">
              ...
            </div>
          )}

          {Array.from(
            { length: totalPages - currentPage < 6 ? totalPages - currentPage + 3 : 3 },
            (_, index) => index + (totalPages - currentPage < 6 ? currentPage : totalPages) - 2,
          ).map((page) => (
            <PaginationButton
              key={page}
              onClick={() => onPageChange(page)}
              disabled={disabled}
              className={`min-w-8 px-2 ${page === currentPage ? 'bg-lime-300' : 'bg-lime-500'}`}
              text={String(page)}
              ariaCurrent={page === currentPage ? 'page' : undefined}
            />
          ))}
        </>
      )}

      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        className="bg-lime-500 px-3"
        text="Next"
      />
    </nav>
  );
}
