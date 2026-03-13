'use client';

import { useEffect } from 'react';

export function PWARegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('XIXIBOLA PRIME: Service Worker registered', registration.scope);
        })
        .catch((error) => {
          console.log('XIXIBOLA PRIME: Service Worker registration failed', error);
        });
    }
  }, []);

  return null;
}
