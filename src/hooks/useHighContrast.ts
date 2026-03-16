"use client";
import { useEffect, useState } from 'react';

export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('access-health-hc');
    if (saved === 'true') {
      setIsHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const toggle = () => {
    const newVal = !isHighContrast;
    setIsHighContrast(newVal);
    localStorage.setItem('access-health-hc', String(newVal));
    document.documentElement.classList.toggle('high-contrast');
  };

  return { isHighContrast, toggle };
}
