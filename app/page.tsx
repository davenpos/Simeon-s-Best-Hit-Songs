import SongTable from '@/components/SongTable';
import { prisma } from '@/lib/prisma';
import { withContextualRanks } from '@/lib/songRanks';

export default async function Page() {
  const songs = await prisma.song.findMany({
    orderBy: {
      rank: 'asc',
    },
  });

  const songsWithRanks = await withContextualRanks(songs);

  return (
    <>
      <header className="mb-8 text-center sm:mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-sm sm:text-5xl">
          Simeon&apos;s Best Hit Songs
        </h1>
      </header>
      <SongTable songs={songsWithRanks} />
    </>
  );
}
