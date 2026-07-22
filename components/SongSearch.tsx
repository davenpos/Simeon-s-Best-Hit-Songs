'use client';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useRef } from 'react';

export default function SongSearch({
  value,
  onChange,
  isExpanded,
  onExpandedChange,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  isExpanded: boolean;
  onExpandedChange: (isExpanded: boolean) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded) inputRef.current?.focus();
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        if (!value.trim()) {
          onExpandedChange(false);
        }
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onChange('');
        onExpandedChange(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded, onChange, onExpandedChange, value]);

  function handleToggle() {
    if (disabled) return;

    if (isExpanded && !value.trim()) {
      onExpandedChange(false);
      return;
    }

    onExpandedChange(true);
  }

  return (
    <div className="mt-2 flex justify-center">
      <div
        ref={containerRef}
        className={`flex items-center overflow-hidden rounded-full bg-lime-500 shadow-sm transition-all duration-300 ease-out ${
          isExpanded ? 'w-64 sm:w-80' : 'w-9'
        } ${disabled ? 'opacity-60' : ''}`}
      >
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          aria-label={isExpanded ? 'Search songs' : 'Open search'}
          aria-expanded={isExpanded}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-white transition-colors duration-300 hover:bg-lime-600 disabled:cursor-default cursor-pointer"
        >
          <SearchIcon sx={{ fontSize: 20 }} />
        </button>
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search title or artist"
          disabled={disabled || !isExpanded}
          tabIndex={isExpanded ? 0 : -1}
          aria-hidden={!isExpanded}
          className={`h-9 min-w-0 flex-1 bg-transparent pr-3 text-sm text-white placeholder:text-lime-100/80 outline-none transition-opacity duration-200 ${
            isExpanded ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        />
      </div>
    </div>
  );
}
