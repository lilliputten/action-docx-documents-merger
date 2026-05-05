// Custom process polyfill that extends process/browser.js with Node.js-specific properties
// This is needed for libraries like adm-zip that expect process.versions to exist

// Import and directly modify the base browser process polyfill

// eslint-disable-next-line @typescript-eslint/no-require-imports
var process = require('process/browser');

// Add versions property if it doesn't exist
process.versions = Object.assign(
  {
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
  process.versions,
);

module.exports = process;
