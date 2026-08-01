import HomeContent from '@/components/HomeContent';
import { prisma } from '@/lib/prisma';
import withContextualRanks from '@/functions/withContextualRanks';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const songs = await prisma.song.findMany({
    orderBy: {
      rank: 'asc',
    },
  });

  const songsWithRanks = await withContextualRanks(songs);

  return <HomeContent songs={songsWithRanks} />;
}
