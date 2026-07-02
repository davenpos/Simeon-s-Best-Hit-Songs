'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AboutModal from './AboutModal';
import SongTable from './SongTable';
import getDecadeStart from '@/functions/getDecadeStart';
import { SongTableProps } from '@/types/interfaces';

const DECADES = ['1990s', '2000s', '2010s'] as const;
const BASE_TIME_BUTTONS = ['All-time', ...DECADES];

function getYearButtonsForDecade(decadeLabel: string) {
  const decadeStart = parseInt(decadeLabel.slice(0, -1), 10);
  return Array.from({ length: 10 }, (_, index) => String(decadeStart + index));
}

export default function HomeContent({ songs }: SongTableProps) {
  const closeTimeoutRef = useRef<number | null>(null);

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAboutClosing, setIsAboutClosing] = useState(false);
  const [isSongModalActive, setIsSongModalActive] = useState(false);
  const [selectedTimeId, setSelectedTimeId] = useState('All-time');

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

  const isAnyModalActive = isAboutOpen || isSongModalActive;

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
        </div>
      </header>

      <SongTable
        songs={songs}
        blockInteractions={isAboutOpen}
        onModalActiveChange={setIsSongModalActive}
      />

      {isAboutOpen && <AboutModal isClosing={isAboutClosing} onClose={closeAboutModal} />}
    </>
  );
}
