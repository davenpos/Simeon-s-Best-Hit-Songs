'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AboutModal from './AboutModal';
import Pagination from './Pagination';
import SongSearch from './SongSearch';
import SongTable from './SongTable';
import getDecadeStart from '@/functions/getDecadeStart';
import { SongDetails, SongTableProps } from '@/types/interfaces';

const DECADES = ['1990s', '2000s', '2010s'] as const;
const BASE_TIME_BUTTONS = ['All-time', ...DECADES];
const PAGE_SIZE = 20;

function getYearButtonsForDecade(decadeLabel: string) {
  const decadeStart = parseInt(decadeLabel.slice(0, -1), 10);
  return Array.from({ length: 10 }, (_, index) => String(decadeStart + index));
}

function filterSongsByTimeId(songs: SongDetails[], selectedTimeId: string) {
  if (selectedTimeId === 'All-time') {
    return songs;
  }

  if (DECADES.includes(selectedTimeId as (typeof DECADES)[number])) {
    const decadeStart = parseInt(selectedTimeId.slice(0, -1), 10);
    const decadeEnd = decadeStart + 9;
    return songs.filter((song) => song.year >= decadeStart && song.year <= decadeEnd);
  }

  const year = parseInt(selectedTimeId, 10);
  if (!Number.isNaN(year)) {
    return songs.filter((song) => song.year === year);
  }

  return songs;
}

function getSongLimit(selectedTimeId: string) {
  if (selectedTimeId === 'All-time') return 1000;
  if (DECADES.includes(selectedTimeId as (typeof DECADES)[number])) return 100;
  return 20;
}

function isPaginatedView(selectedTimeId: string) {
  return (
    selectedTimeId === 'All-time' || DECADES.includes(selectedTimeId as (typeof DECADES)[number])
  );
}

function filterSongsBySearch(songs: SongDetails[], query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return songs;

  return songs.filter(
    (song) =>
      song.title.toLowerCase().includes(trimmed) || song.artist.toLowerCase().includes(trimmed),
  );
}

export default function HomeContent({ songs }: SongTableProps) {
  const closeTimeoutRef = useRef<number | null>(null);

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAboutClosing, setIsAboutClosing] = useState(false);
  const [isSongModalActive, setIsSongModalActive] = useState(false);
  const [selectedTimeId, setSelectedTimeId] = useState('All-time');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const visibleTimeButtons = useMemo(() => {
    if (selectedTimeId === 'All-time') {
      return BASE_TIME_BUTTONS;
    }

    if (DECADES.includes(selectedTimeId as (typeof DECADES)[number])) {
      return ['All-time', selectedTimeId, ...getYearButtonsForDecade(selectedTimeId)];
    }

    const year = parseInt(selectedTimeId, 10);
    if (!Number.isNaN(year)) {
      const decadeLabel = `${getDecadeStart(year)}s`;
      return ['All-time', decadeLabel, ...getYearButtonsForDecade(decadeLabel)];
    }

    return BASE_TIME_BUTTONS;
  }, [selectedTimeId]);

  const limitedSongs = useMemo(() => {
    const filtered = filterSongsByTimeId(songs, selectedTimeId);
    return filtered.slice(0, getSongLimit(selectedTimeId));
  }, [songs, selectedTimeId]);

  const searchedSongs = useMemo(
    () => filterSongsBySearch(limitedSongs, searchQuery),
    [limitedSongs, searchQuery],
  );

  const isSearchActive = searchQuery.trim().length > 0;

  const originalDisplayRankBySongRank = useMemo(() => {
    const ranks = new Map<number, number>();
    limitedSongs.forEach((song, index) => {
      ranks.set(song.rank, index + 1);
    });
    return ranks;
  }, [limitedSongs]);

  const getDisplayRank = useCallback(
    (song: SongDetails) => originalDisplayRankBySongRank.get(song.rank) ?? song.rank,
    [originalDisplayRankBySongRank],
  );

  const totalPages = useMemo(() => {
    if (!isPaginatedView(selectedTimeId)) return 1;
    return Math.max(1, Math.ceil(searchedSongs.length / PAGE_SIZE));
  }, [searchedSongs.length, selectedTimeId]);

  const paginatedSongs = useMemo(() => {
    if (!isPaginatedView(selectedTimeId)) return searchedSongs;
    const start = (currentPage - 1) * PAGE_SIZE;
    return searchedSongs.slice(start, start + PAGE_SIZE);
  }, [currentPage, searchedSongs, selectedTimeId]);

  const rankOffset = isPaginatedView(selectedTimeId) ? (currentPage - 1) * PAGE_SIZE : 0;

  const isAnyModalActive = isAboutOpen || isSongModalActive;

  useEffect(() => setCurrentPage(1), [selectedTimeId, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const closeAboutModal = useCallback(() => {
    if (!isAboutOpen || isAboutClosing) return;

    setIsAboutClosing(true);

    closeTimeoutRef.current = window.setTimeout(() => {
      setIsAboutOpen(false);
      setIsAboutClosing(false);
      closeTimeoutRef.current = null;
    }, 200);
  }, [isAboutOpen, isAboutClosing]);

  function openAboutModal() {
    if (isAnyModalActive) return;
    setIsAboutOpen(true);
    setIsAboutClosing(false);
  }

  function handleTimeButtonClick(label: string) {
    setSelectedTimeId(label);
  }

  return (
    <>
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-sm sm:text-5xl">
          Simeon&apos;s Best Hit Songs
        </h1>
        <div className="my-4">
          <button
            type="button"
            onClick={openAboutModal}
            disabled={isAnyModalActive}
            className="rounded-full bg-lime-500 px-2 py-1 shadow-sm transition-all duration-300 hover:bg-lime-600 disabled:cursor-default disabled:opacity-60 cursor-pointer"
          >
            About
          </button>

          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {visibleTimeButtons.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => handleTimeButtonClick(label)}
                disabled={isAnyModalActive}
                className={`rounded-full px-2 py-1 shadow-sm transition-all duration-300 hover:bg-lime-600 disabled:cursor-default disabled:opacity-60 cursor-pointer ${
                  selectedTimeId === label ? 'bg-lime-300' : 'bg-lime-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <SongSearch
            value={searchQuery}
            onChange={setSearchQuery}
            isExpanded={isSearchExpanded}
            onExpandedChange={setIsSearchExpanded}
            disabled={isAnyModalActive}
          />
        </div>
      </header>

      <SongTable
        songs={paginatedSongs}
        rankOffset={rankOffset}
        getDisplayRank={isSearchActive ? getDisplayRank : undefined}
        blockInteractions={isAboutOpen}
        onModalActiveChange={setIsSongModalActive}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        disabled={isAnyModalActive}
      />

      {isAboutOpen && <AboutModal isClosing={isAboutClosing} onClose={closeAboutModal} />}
    </>
  );
}
