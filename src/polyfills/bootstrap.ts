/**
 * Global polyfills initialization for browser environment
 * This file should be imported FIRST in the application entry point
 * to ensure Node.js globals are available before any library code runs.
 * 
 * Needed for libraries like @benedicte/docx-merge that depend on Node.js modules
 */

// Import and configure process polyfill with versions property
import processBase from 'process/browser';

// Add versions property if it doesn't exist (needed by adm-zip and similar libraries)
// We need to use Object.defineProperty because process.versions might be read-only
if (!processBase.versions) {
  Object.defineProperty(processBase, 'versions', {
    value: {
      node: '20.0.0',
      v8: '10.0.0',
      uv: '1.0.0',
      zlib: '1.0.0',
      brotli: '1.0.0',
      ares: '1.0.0',
      modules: '100',
      nghttp2: '1.0.0',
      napi: '8',
      llhttp: '1.0.0',
      openssl: '1.0.0',
      icu: '1.0.0',
      unicode: '1.0.0',
      cldr: '1.0.0',
      tz: '1.0.0',
    },
    writable: true,
    enumerable: true,
    configurable: true,
  });
} else {
  // Merge with existing versions if they exist
  Object.assign(processBase.versions, {
    node: processBase.versions.node || '20.0.0',
  });
}

// Make process globally available
if (typeof window !== 'undefined') {
  (window as any).process = processBase;
}
(globalThis as any).process = processBase;

// Import and make Buffer globally available
import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}
(globalThis as any).Buffer = Buffer;

// Export for potential use
export { processBase as process, Buffer };
