import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    let rank: number,
      title: string,
      artist: string,
      year: number,
      year_end_pos: number,
      hot_100_pos: number,
      album: string,
      label: string,
      isEP: boolean;

    if (!!formData.get('title')) {
      title = formData.get('title') as string;
    } else return new NextResponse(JSON.stringify({ message: 'Missing title' }), { status: 400 });

    if (!!formData.get('artist')) {
      artist = formData.get('artist') as string;
    } else return new NextResponse(JSON.stringify({ message: 'Missing artist' }), { status: 400 });

    if (!!formData.get('year')) {
      year = parseInt(formData.get('year') as string, 10);
    } else return new NextResponse(JSON.stringify({ message: 'Missing year' }), { status: 400 });

    if (!!formData.get('year_end_pos')) {
      year_end_pos = parseInt(formData.get('year_end_pos') as string, 10);
    } else {
      return new NextResponse(JSON.stringify({ message: 'Missing year-end position' }), {
        status: 400,
      });
    }

    if (!!formData.get('hot_100_pos')) {
      hot_100_pos = parseInt(formData.get('hot_100_pos') as string, 10);
    } else {
      return new NextResponse(JSON.stringify({ message: 'Missing Hot 100 peak' }), {
        status: 400,
      });
    }

    album = !!formData.get('album') ? (formData.get('album') as string) : 'Non-album single';
    label = !!formData.get('label') ? (formData.get('label') as string) : 'Self-released';
    isEP = formData.get('isEP') === 'true';

    return new NextResponse(
      JSON.stringify({
        message: 'Song added successfully!',
      }),
      { status: 200 },
    );
  } catch (error: unknown) {
    return new NextResponse(
      JSON.stringify({ message: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500 },
    );
  }
}
