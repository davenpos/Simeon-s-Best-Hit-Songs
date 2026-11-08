'use client';
import { EllipsisId } from '@/types/types';
import { useEffect, useRef, useState } from 'react';

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

function PaginationEllipsis({
  id,
  openId,
  onOpenChange,
  totalPages,
  onPageChange,
  disabled,
}: {
  id: EllipsisId;
  openId: EllipsisId | null;
  onOpenChange: (id: EllipsisId | null) => void;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const isOpen = openId === id;

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;
      onOpenChange(null);
      setValue('');
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen, onOpenChange]);

  const close = () => {
    onOpenChange(null);
    setValue('');
  };

  const submit = () => {
    const parsed = Number.parseInt(value.trim(), 10);
    if (!Number.isNaN(parsed)) {
      const page = Math.min(Math.max(1, parsed), totalPages);
      onPageChange(page);
    }
    close();
  };

  return (
    <div ref={containerRef} className="relative">
      {isOpen && (
        <div className="absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                submit();
              }
              if (event.key === 'Escape') {
                event.preventDefault();
                close();
              }
            }}
            aria-label={`Go to page between 1 and ${totalPages}`}
            placeholder={`1–${totalPages}`}
            className="w-20 rounded-full border border-white/20 bg-white px-2 py-1 text-center text-sm text-black shadow-sm tabular-nums outline-none focus:ring-2 focus:ring-lime-600/80"
          />
        </div>
      )}
      <PaginationButton
        onClick={() => {
          if (disabled) return;
          if (isOpen) close();
          else {
            setValue('');
            onOpenChange(id);
          }
        }}
        disabled={disabled}
        className="bg-lime-500 px-2"
        text="..."
      />
    </div>
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

  const [openEllipsis, setOpenEllipsis] = useState<EllipsisId | null>(null);
  useEffect(() => setOpenEllipsis(null), [currentPage]);

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
              key={page}
              onClick={() => onPageChange(page)}
              disabled={disabled}
              className={`min-w-8 px-2 ${page === currentPage ? 'bg-lime-300' : 'bg-lime-500'}`}
              text={String(page)}
              ariaCurrent={page === currentPage ? 'page' : undefined}
            />
          ))}

          {currentPage - 3 > 3 && (
            <PaginationEllipsis
              id="leading"
              openId={openEllipsis}
              onOpenChange={setOpenEllipsis}
              totalPages={totalPages}
              onPageChange={onPageChange}
              disabled={disabled}
            />
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
            <PaginationEllipsis
              id="trailing"
              openId={openEllipsis}
              onOpenChange={setOpenEllipsis}
              totalPages={totalPages}
              onPageChange={onPageChange}
              disabled={disabled}
            />
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
