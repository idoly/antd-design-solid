import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

mkdirSync('dist/ssr/entries', { recursive: true });
for (const name of readdirSync('src/entries').filter((entry) => entry.endsWith('.ts'))) {
  const source = readFileSync(`src/entries/${name}`, 'utf8');
  const symbol = source.match(/export \{ ([A-Za-z][A-Za-z0-9]*) as default/)?.[1];
  if (!symbol) throw new Error(`Cannot identify default export for ${name}`);
  writeFileSync(`dist/ssr/entries/${name.replace(/\.ts$/, '.js')}`, `export { ${symbol} as default } from '../index.js';\nexport * from '../index.js';\n`);
}
