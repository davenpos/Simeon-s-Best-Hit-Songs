'use client';
import dynamic from 'next/dynamic';
import { AlertColor } from '@mui/material/Alert';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const Alert = dynamic(() => import('@mui/material/Alert'), { ssr: false });

export default function AlertBanner({
  visible,
  message,
  severity,
}: {
  visible: boolean;
  message: string;
  severity: AlertColor;
}) {
  return (
    <div
      className={`fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-all duration-300 ease-out ${
        visible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-6 scale-95 pointer-events-none'
      }`}
    >
      <Alert className="w-full max-w-xl" variant="filled" severity={severity}>
        {message}
      </Alert>
    </div>
  );
}
