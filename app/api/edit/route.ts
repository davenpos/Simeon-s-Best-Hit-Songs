import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import parseSongFormData from '@/functions/parseSongFormData';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const parsed = await parseSongFormData(formData);
    if (parsed.ok === false) return parsed.response;

    const id = parseInt(formData.get('id') as string, 10);
    if (!id) return NextResponse.json({ message: 'Missing song id' }, { status: 400 });

    const {
      title,
      artist,
      year,
      year_end_pos,
      hot_100_pos,
      album,
      albumNote,
      cover,
      genre,
      label,
    } = parsed.data;

    await prisma.song.update({
      where: { id },
      data: {
        title,
        artist,
        year,
        year_end_pos,
        hot_100_pos,
        album,
        albumNote,
        cover,
        genre,
        label,
      },
    });

    return NextResponse.json({ message: 'Song updated successfully!' });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
