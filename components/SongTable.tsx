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
      <table className="w-full">
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
          <tr>
            <th rowSpan={2} className="text-left px-1">
              Rank:
            </th>
            <th rowSpan={2} className="px-1">
              Title:
            </th>
            <th rowSpan={2} className="px-1">
              Artist:
            </th>
            <th rowSpan={2} className="text-right px-1">
              Year:
            </th>
            <th colSpan={2} className="px-1">
              Positions:
            </th>
          </tr>
          <tr>
            <th className="whitespace-nowrap px-1">Year-end:</th>
            <th className="whitespace-nowrap px-1">Hot 100:</th>
          </tr>
        </thead>
        <tbody className={isModalActive ? 'pointer-events-none' : undefined}>
          {songs.map((song) => (
            <tr
              key={song.rank}
              onClick={() => handleRowClick(song)}
              className={`hover:bg-lime-300 duration-300 ${
                isModalActive ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <td className="rounded-l-full px-1">#{song.rank}</td>
              <td className="px-1">{song.title}</td>
              <td className="px-1">{song.artist}</td>
              <td className="px-1 text-right">{song.year}</td>
              <td className="px-1">#{song.year_end_pos}</td>
              <td className="rounded-r-full px-1">#{song.hot_100_pos}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedSong && <SongModal song={selectedSong} isClosing={isClosing} onClose={closeModal} />}
    </>
  );
}
