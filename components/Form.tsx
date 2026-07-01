'use client';

import { SubmitEvent } from 'react';
import FormInput from './FormInput';
import { AlertColor } from '@mui/material/Alert';
import { AdminSong } from '@/types/interfaces';

const formFields = [
  { name: 'title', label: 'Title:', type: 'text' as const },
  { name: 'artist', label: 'Artist', type: 'text' as const },
  { name: 'year', label: 'Year:', type: 'number' as const },
  { name: 'year_end_pos', label: 'Year-end position:', type: 'number' as const },
  { name: 'hot_100_pos', label: 'Hot 100 peak:', type: 'number' as const },
  { name: 'album', label: 'Album:', type: 'text' as const },
  { name: 'albumNote', label: 'Album note:', type: 'text' as const },
  { name: 'cover', label: 'Cover:', type: 'text' as const },
  { name: 'genre', label: 'Genre:', type: 'text' as const },
  { name: 'label', label: 'Label:', type: 'text' as const },
];

export default function Form({
  mode,
  rank,
  initialSong,
  onSuccess,
  onNotify,
}: {
  mode: 'add' | 'edit';
  rank?: number;
  initialSong?: AdminSong;
  onSuccess?: () => void;
  onNotify?: (message: string, severity: AlertColor) => void;
}) {
  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const endpoint = mode === 'add' ? '/api/add' : '/api/edit';

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    onNotify?.(data.message ?? 'Something happened', response.ok ? 'success' : 'error');

    if (response.ok) {
      onSuccess?.();
    }
  }

  const defaults =
    mode === 'edit' && initialSong
      ? {
          title: initialSong.title,
          artist: initialSong.artist,
          year: initialSong.year,
          year_end_pos: initialSong.year_end_pos,
          hot_100_pos: initialSong.hot_100_pos,
          album: initialSong.album ?? '',
          albumNote: initialSong.albumNote ?? '',
          cover: initialSong.cover,
          genre: initialSong.genre,
          label: initialSong.label ?? '',
        }
      : null;

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-y-2 pr-8">
      {mode === 'add' && rank !== undefined && <input type="hidden" name="rank" value={rank} />}
      {mode === 'edit' && initialSong && <input type="hidden" name="id" value={initialSong.id} />}

      {formFields.map((field) => (
        <FormInput
          key={field.name}
          {...field}
          defaultValue={defaults?.[field.name as keyof typeof defaults]}
        />
      ))}

      <input
        type="submit"
        value={mode === 'add' ? 'Add song' : 'Save changes'}
        className="col-span-2 bg-blue-500 fit-content m-auto p-2 rounded-md cursor-pointer shadow-sm"
      />
    </form>
  );
}
