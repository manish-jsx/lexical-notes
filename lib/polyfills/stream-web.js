/**
 * This file provides minimal polyfills for the stream/web module
 * needed by lexical-editor-easy.
 */

// Standard Web Streams API implementations if available in the browser
export const ReadableStream = typeof window !== 'undefined' && window.ReadableStream
  ? window.ReadableStream
  : class ReadableStream {
      constructor() {
        console.warn('ReadableStream polyfill used');
      }
      getReader() {
        return {
          read: () => Promise.resolve({ done: true, value: undefined }),
          releaseLock: () => {},
          cancel: () => Promise.resolve(),
        };
      }
    };

export const WritableStream = typeof window !== 'undefined' && window.WritableStream
  ? window.WritableStream
  : class WritableStream {
      constructor() {
        console.warn('WritableStream polyfill used');
      }
      getWriter() {
        return {
          write: () => Promise.resolve(),
          close: () => Promise.resolve(),
          abort: () => Promise.resolve(),
          releaseLock: () => {},
        };
      }
    };

export const TransformStream = typeof window !== 'undefined' && window.TransformStream
  ? window.TransformStream
  : class TransformStream {
      constructor() {
        console.warn('TransformStream polyfill used');
        this.readable = new ReadableStream();
        this.writable = new WritableStream();
      }
    };

// Add any other exports that might be needed
export const ByteLengthQueuingStrategy = class ByteLengthQueuingStrategy {
  constructor() {
    console.warn('ByteLengthQueuingStrategy polyfill used');
  }
};

export const CountQueuingStrategy = class CountQueuingStrategy {
  constructor() {
    console.warn('CountQueuingStrategy polyfill used');
  }
};

export default {
  ReadableStream,
  WritableStream,
  TransformStream,
  ByteLengthQueuingStrategy,
  CountQueuingStrategy,
};
