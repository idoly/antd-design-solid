import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
export default defineConfig({
  plugins: [solid({ ssr: true })],
  build: {
    ssr: 'src/index.ts',
    outDir: 'dist/ssr',
    emptyOutDir: false,
    rollupOptions: {
      external: ['solid-js', '@solidjs/web'],
      output: { entryFileNames: '[name].js' },
    },
  },
});
