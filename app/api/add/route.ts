import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import parseSongFormData from '@/functions/parseSongFormData';
import { prisma } from '@/lib/prisma';
import pushSongsDown from '@/functions/pushSongsDown';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const parsed = await parseSongFormData(formData);
    if (parsed.ok === false) return parsed.response;

    const {
      title,
      artist,
      year,
      year_end_pos,
      hot_100_pos,
      album,
      albumNote,
      coverURL,
      coverPublicId,
      genre,
      label,
    } = parsed.data;

    let rank: number;

    await prisma.$transaction(async (tx) => {
      rank = parseInt(formData.get('rank') as string, 10);

      if (!rank) {
        const highest = await tx.song.findFirst({
          orderBy: {
            rank: 'desc',
          },
        });

        rank = highest ? highest.rank + 1 : 1;
      } else await pushSongsDown(tx, rank);

      await tx.song.create({
        data: {
          rank,
          title,
          artist,
          year,
          year_end_pos,
          hot_100_pos,
          album,
          albumNote,
          coverURL,
          coverPublicId,
          genre,
          label,
        },
      });
    });

    return NextResponse.json({ message: 'Song added successfully!' });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
