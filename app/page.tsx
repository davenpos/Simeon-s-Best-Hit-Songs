import SongTable from '@/components/SongTable';
import { prisma } from '@/lib/prisma';

export default async function Page() {
  const songs = await prisma.song.findMany({
    orderBy: {
      rank: 'asc',
    },
  });

  return <SongTable songs={songs} />;
}
