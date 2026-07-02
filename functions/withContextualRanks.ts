import { prisma } from '@/lib/prisma';
import type { SongDetails } from '@/types/interfaces';
import getDecadeStart from './getDecadeStart';

function buildRankMap(songs: { rank: number }[]): Map<number, number> {
  const positions = new Map<number, number>();
  songs.forEach((song, index) => positions.set(song.rank, index + 1));
  return positions;
}

export default async function withContextualRanks(
  songs: Omit<SongDetails, 'rankInYear' | 'rankInDecade'>[],
): Promise<SongDetails[]> {
  const years = [...new Set(songs.map((song) => song.year))];
  const decades = [...new Set(songs.map((song) => getDecadeStart(song.year)))];

  const rankInYearByYear = new Map<number, Map<number, number>>();
  await Promise.all(
    years.map(async (year) => {
      const yearSongs = await prisma.song.findMany({
        where: { year },
        orderBy: { rank: 'asc' },
        select: { rank: true },
      });
      rankInYearByYear.set(year, buildRankMap(yearSongs));
    }),
  );

  const rankInDecadeByDecade = new Map<number, Map<number, number>>();
  await Promise.all(
    decades.map(async (decadeStart) => {
      const decadeSongs = await prisma.song.findMany({
        where: {
          year: { gte: decadeStart, lte: decadeStart + 9 },
        },
        orderBy: { rank: 'asc' },
        select: { rank: true },
      });
      rankInDecadeByDecade.set(decadeStart, buildRankMap(decadeSongs));
    }),
  );

  return songs.map((song) => ({
    ...song,
    rankInYear: rankInYearByYear.get(song.year)!.get(song.rank)!,
    rankInDecade: rankInDecadeByDecade.get(getDecadeStart(song.year))!.get(song.rank)!,
  }));
}
