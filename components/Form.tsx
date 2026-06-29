'use client';

import { SubmitEvent, useState } from 'react';
import FormInput from './FormInput';

export default function Form() {
  const [isEP, setIsEP] = useState(false);

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.set('isEP', isEP.toString());
    const response = await fetch('/api/add', {
      method: 'POST',
      body: formData,
    });

    //const data = await response.json();
  }

  const formLabels = [
    {
      name: 'rank',
      label: 'Label:',
      type: 'number',
    },
    {
      name: 'title',
      label: 'Title:',
      type: 'text',
    },
    {
      name: 'artist',
      label: 'Artist',
      type: 'text',
    },
    {
      name: 'year',
      label: 'Year:',
      type: 'number',
    },
    {
      name: 'year_end_pos',
      label: 'Year-end position:',
      type: 'number',
    },
    {
      name: 'hot_100_pos',
      label: 'Hot 100 peak:',
      type: 'number',
    },
    {
      name: 'album',
      label: 'Album:',
      type: 'text',
    },
    {
      name: 'isEP',
      label: 'Is EP:',
      type: 'checkbox',
      onChange: () => setIsEP(!isEP),
    },
    {
      name: 'label',
      label: 'Label:',
      type: 'text',
    },
  ];

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg bg-lime-300 grid grid-cols-2 max-w-2xl m-auto p-2 gap-y-2"
    >
      {formLabels.map((label, i) => (
        <FormInput key={i} {...label} />
      ))}
    </form>
  );
}
