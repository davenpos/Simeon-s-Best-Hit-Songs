'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import SongModal from './SongModal';
import { SongDetails, SongTableProps } from '@/types/interfaces';

export default function SongTable({ songs }: SongTableProps) {
  const [selectedSong, setSelectedSong] = useState<SongDetails | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  const isModalActive = selectedSong !== null;

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const closeModal = useCallback(() => {
    if (!selectedSong || isClosing) return;

    setIsClosing(true);

    closeTimeoutRef.current = window.setTimeout(() => {
      setSelectedSong(null);
      setIsClosing(false);
      closeTimeoutRef.current = null;
    }, 200);
  }, [selectedSong, isClosing]);

  function handleRowClick(song: SongDetails) {
    if (isModalActive) return;
    setSelectedSong(song);
    setIsClosing(false);
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl shadow-lime-900/20 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm sm:text-base">
            <colgroup>
              <col span={1} className="w-0" />
            </colgroup>
            <colgroup>
              <col span={2} />
            </colgroup>
            <colgroup>
              <col span={3} className="w-0" />
            </colgroup>
            <thead>
              <tr className="border-b border-white/15 bg-black/10">
                <th
                  rowSpan={2}
                  className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-lime-100/90"
                >
                  Rank
                </th>
                <th
                  rowSpan={2}
                  className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-lime-100/90"
                >
                  Title
                </th>
                <th
                  rowSpan={2}
                  className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-lime-100/90"
                >
                  Artist
                </th>
                <th
                  rowSpan={2}
                  className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-lime-100/90"
                >
                  Year
                </th>
                <th
                  colSpan={2}
                  className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-lime-100/90"
                >
                  Positions
                </th>
              </tr>
              <tr className="border-b border-white/15 bg-black/10">
                <th className="whitespace-nowrap px-4 py-2 text-left text-xs font-medium text-lime-100/75">
                  Year-end
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left text-xs font-medium text-lime-100/75">
                  Hot 100
                </th>
              </tr>
            </thead>
            <tbody className={isModalActive ? 'pointer-events-none' : undefined}>
              {songs.map((song, index) => (
                <tr
                  key={song.rank}
                  onClick={() => handleRowClick(song)}
                  className={`border-b border-white/10 transition-colors duration-200 last:border-b-0 ${
                    index % 2 === 1 ? 'bg-black/5' : ''
                  } ${
                    isModalActive
                      ? 'cursor-default'
                      : 'cursor-pointer hover:bg-white/15 active:bg-white/20'
                  }`}
                >
                  <td className="px-3 py-2">
                    <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold tabular-nums sm:text-sm">
                      #{song.rank}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium text-white">{song.title}</td>
                  <td className="px-3 py-2 text-lime-50/85">{song.artist}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-lime-50/90">{song.year}</td>
                  <td className="px-3 py-2 tabular-nums text-lime-50/90">#{song.year_end_pos}</td>
                  <td className="px-3 py-2 tabular-nums text-lime-50/90">#{song.hot_100_pos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSong && <SongModal song={selectedSong} isClosing={isClosing} onClose={closeModal} />}
    </>
  );
}
