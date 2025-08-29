import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/**/*.{js,jsx,ts,tsx}'
      ],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.config.js',
        '**/*.config.ts',
        'src/**/*.test.js'
      ]
    }
  }
});
