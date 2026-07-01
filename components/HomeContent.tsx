'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import AboutModal from './AboutModal';
import SongTable from './SongTable';
import { SongTableProps } from '@/types/interfaces';

export default function HomeContent({ songs }: SongTableProps) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAboutClosing, setIsAboutClosing] = useState(false);
  const [isSongModalActive, setIsSongModalActive] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  const isAboutActive = isAboutOpen;
  const isAnyModalActive = isAboutActive || isSongModalActive;

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
        </div>
      </header>

      <SongTable
        songs={songs}
        blockInteractions={isAboutActive}
        onModalActiveChange={setIsSongModalActive}
      />

      {isAboutOpen && <AboutModal isClosing={isAboutClosing} onClose={closeAboutModal} />}
    </>
  );
}
