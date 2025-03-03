/**
 * This file centralizes all polyfills and ensures they're loaded
 * before any component that might need them
 */

// Import the stream/web polyfill to ensure it's loaded
import streamWeb from './stream-web';

// Signal that polyfills are loaded
if (typeof window !== 'undefined') {
  window.polyfillsLoaded = true;
}

export default {
  streamWeb,
};
