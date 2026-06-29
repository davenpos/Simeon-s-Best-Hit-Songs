'use client';
import dynamic from 'next/dynamic';
import { SubmitEvent, useEffect, useState } from 'react';
import FormInput from './FormInput';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const Alert = dynamic(() => import('@mui/material/Alert'), { ssr: false });

export default function Form() {
  const [isEP, setIsEP] = useState(false);
  const [alertMounted, setAlertMounted] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.set('isEP', isEP.toString());
    const response = await fetch('/api/add', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      setAlertMounted(true);
      requestAnimationFrame(() => setAlertVisible(true));
      setTimeout(() => setAlertVisible(false), 5000);
      await response.json();
    }
  }

  useEffect(() => {
    if (!alertMounted || alertVisible) return;
    const timeout = setTimeout(() => setAlertMounted(false), 300);
    return () => clearTimeout(timeout);
  }, [alertMounted, alertVisible]);

  const formLabels = [
    {
      name: 'rank',
      label: 'Rank:',
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
    <>
      {alertMounted && (
        <div
          className={`fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-all duration-300 ease-out ${alertVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95'}`}
        >
          <Alert className="w-full max-w-xl" variant="filled" severity="success">
            Song added successfully!
          </Alert>
        </div>
      )}
      <form
        onSubmit={onSubmit}
        className="rounded-lg bg-lime-300 grid grid-cols-2 max-w-2xl m-auto p-2 gap-y-2"
      >
        {formLabels.map((label, i) => (
          <FormInput key={i} {...label} />
        ))}

        <input
          type="submit"
          value="Submit"
          className="col-span-2 bg-blue-500 fit-content m-auto p-2 rounded-md cursor-pointer shadow-sm"
        />
      </form>
    </>
  );
}
