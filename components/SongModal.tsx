'use client';
import { SongDetails } from '@/types/interfaces';
import { Fragment, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

export default function SongModal({
  song,
  isClosing,
  onClose,
}: {
  song: SongDetails;
  isClosing: boolean;
  onClose: () => void;
}) {
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const songAlbums = song.album ? song.album.split('/') : [];

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsZoomedIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isOpen = isZoomedIn && !isClosing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="song-modal-title"
        className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-lime-300 p-4 text-black shadow-xl transition-all duration-200 ease-out origin-center ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-lime-500 text-white text-xl leading-none cursor-pointer hover:bg-lime-600 transition-colors"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <img
            src={song.cover}
            alt={`${song.title} cover`}
            className="mx-auto h-40 w-40 shrink-0 rounded-md object-cover sm:mx-0"
          />
          <div className="min-w-0 flex-1 pr-8">
            <h2 id="song-modal-title" className="text-xl font-bold">
              {song.title}
            </h2>
            <p className="text-lg">{song.artist}</p>
            <div className="flex">
              <dt className="text-sm font-medium text-lime-700">Rank in all-time:</dt>
              &nbsp;
              <dd className="text-sm">#{song.rank}</dd>
            </div>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="font-medium text-lime-700">Year:</dt>
            <dd>{song.year}</dd>
          </div>
          <div>
            <dt className="font-medium text-lime-700">Genre:</dt>
            <dd>{song.genre}</dd>
          </div>
          <div>
            <dt className="font-medium text-lime-700">Year-end position:</dt>
            <dd>#{song.year_end_pos}</dd>
          </div>
          <div>
            <dt className="font-medium text-lime-700">Hot 100 peak:</dt>
            <dd>#{song.hot_100_pos}</dd>
          </div>
          <div className="col-span-2">
            <dt className="font-medium text-lime-700">Album:</dt>
            <dd>
              {songAlbums.length ? (
                <>
                  {songAlbums.map((album, i) => (
                    <Fragment key={i}>
                      <span className="italic">{album}</span>
                      {song.albumNote ? ` (${song.albumNote})` : ''}
                      {i > 0 && <>/</>}
                    </Fragment>
                  ))}
                </>
              ) : (
                <>Non-album single</>
              )}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="font-medium text-lime-700">Label:</dt>
            <dd>{song.label ? song.label : 'Self-released'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
