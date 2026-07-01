'use client';
import { AlertColor } from '@mui/material/Alert';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useAlert() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');
  const hideTimeoutRef = useRef<number | null>(null);

  const showAlert = useCallback((nextMessage: string, nextSeverity: AlertColor = 'success') => {
    setMessage(nextMessage);
    setSeverity(nextSeverity);
    setVisible(true);

    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

    hideTimeoutRef.current = window.setTimeout(() => {
      setVisible(false);
      hideTimeoutRef.current = null;
    }, 5000);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return { visible, message, severity, showAlert };
}
