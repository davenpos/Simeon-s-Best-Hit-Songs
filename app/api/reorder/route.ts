import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const songId = parseInt(body.songId, 10);
    const fromRank = parseInt(body.fromRank, 10);
    const toRank = parseInt(body.toRank, 10);

    if (!songId || !fromRank || !toRank) {
      return NextResponse.json({ message: 'Missing reorder fields' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      if (fromRank === toRank || fromRank === toRank - 1) return;

      await tx.song.update({
        where: { id: songId },
        data: { rank: -songId },
      });

      if (fromRank < toRank) {
        await tx.$executeRaw`
          UPDATE "Song"
          SET rank = rank - 1
          WHERE rank > ${fromRank} AND rank <= ${toRank}
        `;
      } else {
        await tx.$executeRaw`
          UPDATE "Song"
          SET rank = rank + 1
          WHERE rank >= ${toRank} AND rank < ${fromRank}
        `;
      }

      await tx.song.update({
        where: { id: songId },
        data: { rank: toRank },
      });
    });

    return NextResponse.json({ message: 'Song reordered successfully!' });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
