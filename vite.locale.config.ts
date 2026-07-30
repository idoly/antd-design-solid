import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { readdirSync } from 'node:fs';

const localeEntries = Object.fromEntries(readdirSync('src/locale', { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => [`locale/${entry.name}`, `src/locale/${entry.name}/index.ts`]));

export default defineConfig({
  plugins: [solid()],
  build: {
    emptyOutDir: false,
    lib: {
      entry: { 'locale/index': 'src/locale/index.ts', ...localeEntries },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: { external: ['solid-js', '@solidjs/web'] },
  },
});
