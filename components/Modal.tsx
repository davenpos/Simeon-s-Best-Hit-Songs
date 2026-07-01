'use client';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode, useEffect, useState } from 'react';

export default function Modal({
  isClosing,
  onClose,
  titleId,
  sizeClass,
  children,
}: {
  isClosing: boolean;
  onClose: () => void;
  titleId?: string;
  sizeClass: string;
  children: ReactNode;
}) {
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsZoomedIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isOpen = isZoomedIn && !isClosing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative w-full max-h-[90vh] overflow-y-auto rounded-lg bg-lime-300 p-4 text-black shadow-xl transition-all duration-200 ease-out origin-center ${sizeClass} ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-lime-500 text-white text-xl leading-none cursor-pointer hover:bg-lime-600 transition-colors"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
}
