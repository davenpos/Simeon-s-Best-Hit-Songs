import { NextResponse } from 'next/server';
import uploadToCloudinary from '@/functions/cloudinaryUpload';

interface ParsedSongFields {
  title: string;
  artist: string;
  year: number;
  year_end_pos: number;
  hot_100_pos: number;
  album: string;
  albumNote: string | null;
  cover: string;
  genre: string;
  label: string;
}

export default async function parseSongFormData(
  formData: FormData,
): Promise<{ ok: true; data: ParsedSongFields } | { ok: false; response: NextResponse }> {
  let title: string;
  let artist: string;
  let year: number;
  let year_end_pos: number;
  let hot_100_pos: number;
  let cover: string;
  let genre: string;

  if (!!formData.get('title')) {
    title = formData.get('title') as string;
  } else {
    return {
      ok: false,
      response: NextResponse.json({ message: 'Missing title' }, { status: 400 }),
    };
  }

  if (!!formData.get('artist')) {
    artist = formData.get('artist') as string;
  } else {
    return {
      ok: false,
      response: NextResponse.json({ message: 'Missing artist' }, { status: 400 }),
    };
  }

  if (!!formData.get('year')) {
    year = parseInt(formData.get('year') as string, 10);
  } else {
    return {
      ok: false,
      response: NextResponse.json({ message: 'Missing year' }, { status: 400 }),
    };
  }

  if (!!formData.get('year_end_pos')) {
    year_end_pos = parseInt(formData.get('year_end_pos') as string, 10);
  } else {
    return {
      ok: false,
      response: NextResponse.json({ message: 'Missing year-end position' }, { status: 400 }),
    };
  }

  if (!!formData.get('hot_100_pos')) {
    hot_100_pos = parseInt(formData.get('hot_100_pos') as string, 10);
  } else {
    return {
      ok: false,
      response: NextResponse.json({ message: 'Missing Hot 100 peak' }, { status: 400 }),
    };
  }

  const coverFile = formData.get('cover');
  const existingCover = formData.get('existingCover') as string | null;

  if (coverFile instanceof File && coverFile.size > 0) {
    cover = await uploadToCloudinary(coverFile);
  } else if (existingCover) cover = existingCover;
  else {
    return {
      ok: false,
      response: NextResponse.json({ message: 'Missing cover image' }, { status: 400 }),
    };
  }

  if (!!formData.get('genre')) {
    genre = formData.get('genre') as string;
  } else {
    return {
      ok: false,
      response: NextResponse.json({ message: 'Missing genre' }, { status: 400 }),
    };
  }

  const album = !!formData.get('album') ? (formData.get('album') as string) : 'Non-album single';
  const albumNote = !!formData.get('albumNote') ? (formData.get('albumNote') as string) : null;
  const label = !!formData.get('label') ? (formData.get('label') as string) : 'Self-released';

  return {
    ok: true,
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
  };
}
