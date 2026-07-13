import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/client';

export default async function pushSongsDown(
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$use' | '$extends'
  >,
  start: number,
  stop?: number,
) {
  if (stop) {
    await tx.$executeRaw`
      UPDATE "Song"
      SET rank = rank + 1000000
      WHERE rank >= ${start} AND rank < ${stop}
    `;
  } else {
    await tx.$executeRaw`
      UPDATE "Song"
      SET rank = rank + 1000000
      WHERE rank >= ${start}
    `;
  }

  await tx.$executeRaw`
    UPDATE "Song"
    SET rank = rank - 999999
    WHERE rank >= ${start + 1000000}
  `;
}
