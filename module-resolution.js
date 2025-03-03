/**
 * This file configures module resolution for problematic dependencies
 */

const path = require('path');

module.exports = {
  // Custom module aliases
  alias: {
    // Alias stream/web to our custom polyfill
    'stream/web': path.resolve(__dirname, 'lib/polyfills/stream-web.js'),
  },
  
  // Fallbacks for Node.js built-in modules when imported in browser context
  fallback: {
    net: false,
    tls: false,
    fs: false,
    child_process: false,
    http: false,
    https: false,
    stream: false,
    crypto: false,
    os: false,
    path: false,
    dgram: false,
    dns: false,
    zlib: false,
    util: false,
  },
};
