import { readdirSync } from 'node:fs';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const componentEntries = Object.fromEntries(readdirSync('src/entries')
  .filter((name) => name.endsWith('.ts'))
  .map((name) => [`entries/${name.slice(0, -3)}`, `src/entries/${name}`]));

export default defineConfig({
  plugins: [solid({ ssr: true })],
  build: {
    ssr: true,
    outDir: 'dist/ssr',
    emptyOutDir: false,
    rollupOptions: {
      input: { index: 'src/index.ts', ...componentEntries },
      external: ['solid-js', '@solidjs/web'],
      output: { entryFileNames: '[name].js' },
    },
  },
});
