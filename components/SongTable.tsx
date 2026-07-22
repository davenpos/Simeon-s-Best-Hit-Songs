'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import SongModal from './SongModal';
import { SongDetails, SongTableProps } from '@/types/interfaces';
import useWindowIsSmall from '@/hooks/useWindowIsSmall';
import SongRank from './SongRank';
import SongDetail from './SongDetail';

export default function SongTable({
  songs,
  rankOffset = 0,
  getDisplayRank,
  blockInteractions = false,
  onModalActiveChange,
}: SongTableProps) {
  const [selectedSong, setSelectedSong] = useState<SongDetails | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const isSmall = useWindowIsSmall();
  const closeTimeoutRef = useRef<number | null>(null);

  const isSongModalActive = selectedSong !== null;
  const interactionsBlocked = isSongModalActive || blockInteractions;

  useEffect(() => {
    onModalActiveChange?.(isSongModalActive);
  }, [isSongModalActive, onModalActiveChange]);

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
    if (interactionsBlocked) return;
    setSelectedSong(song);
    setIsClosing(false);
  }

  return (
    <>
      {isSmall ? (
        <>
          {songs.map((song, index) => (
            <div
              key={song.rank}
              onClick={() => handleRowClick(song)}
              className={`rounded-2xl w-full text-sm sm:text-base border border-white/20 shadow-xl px-3 py-2 transition-colors duration-200 bg-black/5 grid grid-cols-[auto_1fr] gap-2 ${
                interactionsBlocked
                  ? 'cursor-default'
                  : 'cursor-pointer hover:bg-white/15 active:bg-white/20'
              }${index === 0 ? '' : ' mt-4'}`}
            >
              <SongRank rank={getDisplayRank ? getDisplayRank(song) : rankOffset + index + 1} />
              <h2 className="text-xl font-medium h-fit self-center">
                {song.artist} - {song.title}
              </h2>
              <div></div>
              <dl className="text-lime-50/90 text-sm flex flex-wrap justify-between gap-x-2">
                <div className="flex gap-1">
                  <dt className="font-medium">Year: </dt>
                  <dd>{song.year}</dd>
                </div>
                <div className="flex gap-1">
                  <dt className="font-medium">Year-end pos.: </dt>
                  <dd>#{song.year_end_pos}</dd>
                </div>
                <div className="flex gap-1">
                  <dt className="font-medium">Hot 100 pos.: </dt>
                  <dd>#{song.hot_100_pos}</dd>
                </div>
              </dl>
            </div>
          ))}
        </>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl shadow-lime-900/20 backdrop-blur-sm">
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
            <tbody className={interactionsBlocked ? 'pointer-events-none' : undefined}>
              {songs.map((song, index) => (
                <tr
                  key={song.rank}
                  onClick={() => handleRowClick(song)}
                  className={`border-b border-white/10 transition-colors duration-200 last:border-b-0 ${
                    index % 2 === 1 ? 'bg-black/5' : ''
                  } ${
                    interactionsBlocked
                      ? 'cursor-default'
                      : 'cursor-pointer hover:bg-white/15 active:bg-white/20'
                  }`}
                >
                  <td className="px-3 py-2">
                    <SongRank
                      rank={getDisplayRank ? getDisplayRank(song) : rankOffset + index + 1}
                    />
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
      )}

      {selectedSong && <SongModal song={selectedSong} isClosing={isClosing} onClose={closeModal} />}
    </>
  );
}
