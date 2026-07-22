import { useState, useEffect } from 'react';

export default function useWindowIsSmall() {
  const [isSmall, setIsSmall] = useState(true);

  useEffect(() => {
    function updateValue() {
      if (window.innerWidth >= 768) setIsSmall(false);
      else setIsSmall(true);
    }

    updateValue();

    window.addEventListener('resize', updateValue);
    return () => window.removeEventListener('resize', updateValue);
  }, []);

  return isSmall;
}
