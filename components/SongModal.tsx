'use client';
import { SongDetails } from '@/types/interfaces';
import { Fragment } from 'react';
import Modal from './Modal';
import SongDetail from './SongDetail';

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
          src={song.coverURL}
          alt={`${song.title} cover`}
          className="mx-auto h-40 w-40 shrink-0 rounded-md sm:mx-0"
        />
        <div className="min-w-0 flex-1 pr-8">
          <h2 id="song-modal-title" className="text-xl font-bold">
            {song.title}
          </h2>
          <p className="text-lg">{song.artist}</p>
          <SongDetail
            term="Rank in year"
            details={`#${song.rankInYear}`}
            className="flex"
            rank={true}
          />
          <SongDetail
            term="Rank in decade"
            details={`#${song.rankInDecade}`}
            className="flex"
            rank={true}
          />
          <SongDetail
            term="Rank in all-time"
            details={song.rank <= 1000 ? `#${song.rank}` : '>#1000'}
            className="flex"
            rank={true}
          />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <SongDetail term="Year" details={song.year} />
        <SongDetail term="Genre" details={song.genre} />
        <SongDetail term="Year-end position" details={`#${song.year_end_pos}`} />
        <SongDetail term="Hot 100 position" details={`#${song.hot_100_pos}`} />
        <SongDetail
          term="Album"
          details={
            songAlbums.length ? (
              <>
                {songAlbums.map((album, i) => (
                  <Fragment key={i}>
                    {i > 0 ? <>/</> : <>{song.albumNote ? ` (${song.albumNote})` : ''}</>}
                    <span className="italic">{album}</span>
                  </Fragment>
                ))}
              </>
            ) : (
              <>Non-album single</>
            )
          }
          className="col-span-2"
        />
        <SongDetail
          term="Label"
          details={song.label ? song.label : 'Self-released'}
          className="col-span-2"
        />
      </dl>
    </Modal>
  );
}
