import { vi } from 'vitest';

// Mock Firebase modules
vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  push: vi.fn(),
  onValue: vi.fn(),
  query: vi.fn(),
  orderByChild: vi.fn(),
  startAt: vi.fn(),
  endAt: vi.fn()
}));

// Mock DOM methods used in StatManager
Object.defineProperty(document, 'body', {
  value: {
    appendChild: vi.fn(),
    removeChild: vi.fn()
  },
  writable: true
});

// Global test utilities
global.vi = vi;
