// Polyfills for XMTP compatibility
import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).global = window;
  global.Buffer = Buffer;

  // Polyfill for crypto.getRandomValues if not available
  if (!window.crypto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).crypto = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getRandomValues: (array: any): any => {
        for (let i = 0, l = array.length; i < l; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return array;
      },
    };
  }
} 