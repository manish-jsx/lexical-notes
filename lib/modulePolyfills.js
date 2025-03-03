/**
 * This file provides polyfills or empty implementations for Node.js modules
 * that might be imported by third-party libraries but are not available in the browser.
 */

// Add global polyfills that will be used when imports fail
if (typeof window !== 'undefined') {
  // Empty implementation for stream/web
  window.streamWeb = {
    ReadableStream: typeof ReadableStream !== 'undefined' ? ReadableStream : class {},
    WritableStream: typeof WritableStream !== 'undefined' ? WritableStream : class {},
    TransformStream: typeof TransformStream !== 'undefined' ? TransformStream : class {},
  };
  
  // Other potential polyfills can be added here as needed
}

export default {};
