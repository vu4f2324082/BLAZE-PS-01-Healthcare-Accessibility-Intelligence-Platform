'use client';

/**
 * TASK-06: HighContrastProvider
 * Client-only component that reads localStorage on mount and applies/restores
 * the .high-contrast class to <body>. Rendered inside RootLayout.
 */
import { useEffect } from 'react';

export default function HighContrastProvider() {
  useEffect(() => {
    const stored = localStorage.getItem('high-contrast');
    if (stored === 'true') {
      document.body.classList.add('high-contrast');
    }
  }, []);

  return null;
}
