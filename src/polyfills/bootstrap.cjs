// Bootstrap file to ensure Node.js polyfills are available globally before any module loads
// This is critical for libraries like adm-zip that expect process.versions to exist

// First, ensure process is available with all required properties
var processPolyfill = require('process/browser');

if (!processPolyfill.versions) {
  processPolyfill.versions = {
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
  };
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.process = processPolyfill;
}
global.process = processPolyfill;

// Also ensure Buffer is available
var Buffer = require('buffer/').Buffer;
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}
global.Buffer = Buffer;
