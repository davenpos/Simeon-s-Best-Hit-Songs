'use client';
import dynamic from 'next/dynamic';
import { SubmitEvent, useEffect, useRef, useState } from 'react';
import FormInput from './FormInput';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AlertColor } from '@mui/material/Alert';

const Alert = dynamic(() => import('@mui/material/Alert'), { ssr: false });

export default function Form() {
  const [isEP, setIsEP] = useState(false);
  const [alertMounted, setAlertMounted] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success');
  const hideTimeoutRef = useRef<number | null>(null);

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.set('isEP', isEP.toString());

    const response = await fetch('/api/add', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setAlertMessage(data.message ?? 'Something happened');
    setAlertSeverity(response.ok ? 'success' : 'error');

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    setAlertVisible(true);

    hideTimeoutRef.current = window.setTimeout(() => {
      setAlertVisible(false);
      hideTimeoutRef.current = null;
    }, 5000);

    if (response.ok) {
      event.target.reset();
      setIsEP(false);
    }
  }

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

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
      name: 'cover',
      label: 'Cover:',
      type: 'text',
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
          className={`fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-all duration-300 ease-out ${
            alertVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-6 scale-95 pointer-events-none'
          }`}
        >
          <Alert className="w-full max-w-xl" variant="filled" severity={alertSeverity}>
            {alertMessage}
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
