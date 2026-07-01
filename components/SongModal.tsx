'use client';
import { SongDetails } from '@/types/interfaces';
import { Fragment } from 'react';
import Modal from './Modal';

export default function SongModal({
  song,
  isClosing,
  onClose,
}: {
  song: SongDetails;
  isClosing: boolean;
  onClose: () => void;
}) {
  const songAlbums = song.album ? song.album.split('/') : [];

  return (
    <Modal isClosing={isClosing} onClose={onClose} titleId="song-modal-title" sizeClass="max-w-lg">
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
            <dt className="text-sm font-medium text-lime-700">Rank in year:</dt>
            &nbsp;
            <dd className="text-sm">#{song.rankInYear}</dd>
          </div>
          <div className="flex">
            <dt className="text-sm font-medium text-lime-700">Rank in decade:</dt>
            &nbsp;
            <dd className="text-sm">#{song.rankInDecade}</dd>
          </div>
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
                    {i > 0 ? <>/</> : <>{song.albumNote ? ` (${song.albumNote})` : ''}</>}
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
    </Modal>
  );
}
