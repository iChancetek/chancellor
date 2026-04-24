'use client';

import { useEffect } from 'react';

export default function PWARegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.protocol === 'http:' && window.location.hostname === 'localhost') {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
          function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          function (err) {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    } else if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
          function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          function (err) {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  return null;
}
