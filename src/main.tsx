import React from 'react';
import { createRoot } from 'react-dom/client';

import '@/index.css';

import { isDev, versionInfo } from '@/config/env';
import App from '@/App';

const node = document.getElementById('root');

const VITE_NO_STRICT_MODE = import.meta.env.VITE_NO_STRICT_MODE;

// eslint-disable-next-line no-console
console.log('[client/src/main] versionInfo:', versionInfo);
// eslint-disable-next-line no-console
console.log('[client/src/main] isDev:', isDev);

let content = <App />;

if (isDev && !VITE_NO_STRICT_MODE) {
  content = (
    <React.StrictMode>
      {/* Wrap content in StrictMode if development mode */}
      {content}
    </React.StrictMode>
  );
}

createRoot(node!).render(content);

/*
 * // DEBUG: Handle vite runtime errors
 * if (isDev) {
 *   const showErrorOverlay = (err: unknown) => {
 *     const ErrorOverlay = customElements.get('vite-error-overlay');
 *     if (!ErrorOverlay) return;
 *     const overlay = new ErrorOverlay(err);
 *     document.body.appendChild(overlay);
 *   };
 *   window.addEventListener('error', showErrorOverlay);
 *   window.addEventListener('unhandledrejection', ({ reason }) => showErrorOverlay(reason));
 * }
 */
