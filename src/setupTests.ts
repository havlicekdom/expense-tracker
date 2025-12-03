import '@testing-library/jest-dom/vitest'; //extends Vitest's expect method with methods from react-testing-library
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

afterEach(() => {
   cleanup();
});
