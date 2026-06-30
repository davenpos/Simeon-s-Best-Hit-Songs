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

  return <SongTable songs={songsWithRanks} />;
}
