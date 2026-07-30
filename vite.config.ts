import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';
import { readdirSync } from 'node:fs';

const componentEntries = Object.fromEntries(readdirSync('src/entries')
  .filter((name) => name.endsWith('.ts'))
  .map((name) => [`entries/${name.slice(0, -3)}`, `src/entries/${name}`]));

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  build: {
    lib: {
      entry: { index: 'src/bundle.ts', ...componentEntries },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'ant-design-solid',
    },
    emptyOutDir: true,
    rollupOptions: {
      external: ['solid-js', '@solidjs/web'],
    },
  },
  test: {
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
