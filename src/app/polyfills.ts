// Polyfills for XMTP compatibility
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

// Polyfill for crypto.getRandomValues if not available
if (typeof window !== 'undefined' && !window.crypto) {
  (window as any).crypto = {
    getRandomValues: (arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }
  };
} 