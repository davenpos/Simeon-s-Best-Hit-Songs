import AdminSongList from '@/components/AdminSongList';
import { prisma } from '@/lib/prisma';

export default async function Page() {
  const songs = await prisma.song.findMany({
    orderBy: {
      rank: 'asc',
    },
  });

  return (
    <>
      <header className="mb-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl">
          Manage Songs
        </h1>
        <p className="mt-2 text-sm text-lime-50/80">
          Click a row to edit. Click and hold to drag. Hover between rows to add.
        </p>
      </header>
      <AdminSongList initialSongs={songs} />
    </>
  );
}
