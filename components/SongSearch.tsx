'use client';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useRef } from 'react';
import { SearchMode } from '@/types/types';

const SEARCH_MODE_OPTIONS: { value: SearchMode; label: string }[] = [
  { value: 'title', label: 'Title' },
  { value: 'artist', label: 'Artist' },
  { value: 'both', label: 'Both' },
];

function getPlaceholder(mode: SearchMode) {
  if (mode === 'title') return 'Search title';
  if (mode === 'artist') return 'Search artist';
  return 'Search title or artist';
}

export default function SongSearch({
  value,
  onChange,
  searchMode,
  onSearchModeChange,
  isExpanded,
  onExpandedChange,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  searchMode: SearchMode;
  onSearchModeChange: (mode: SearchMode) => void;
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
          isExpanded ? 'w-full max-w-xl' : 'w-9'
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
          placeholder={getPlaceholder(searchMode)}
          disabled={disabled || !isExpanded}
          tabIndex={isExpanded ? 0 : -1}
          aria-hidden={!isExpanded}
          className={`h-9 min-w-0 flex-1 bg-transparent px-1 text-sm text-white placeholder:text-lime-100/80 outline-none transition-opacity duration-200 ${
            isExpanded ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        />
        <div
          className={`flex shrink-0 items-center gap-1 pr-1 transition-opacity duration-200 ${
            isExpanded ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          aria-hidden={!isExpanded}
        >
          {SEARCH_MODE_OPTIONS.map(({ value: mode, label }) => (
            <button
              key={mode}
              type="button"
              onClick={() => onSearchModeChange(mode)}
              disabled={disabled || !isExpanded}
              tabIndex={isExpanded ? 0 : -1}
              className={`rounded-full px-2 py-1 text-xs shadow-sm transition-all duration-300 hover:bg-lime-600 disabled:cursor-default cursor-pointer ${
                searchMode === mode ? 'bg-lime-300' : 'bg-lime-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
