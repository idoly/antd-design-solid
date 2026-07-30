import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../dist');
const declarations = [];
const visit = (directory) => readdirSync(directory).forEach((name) => {
  const path = join(directory, name);
  if (statSync(path).isDirectory()) visit(path);
  else if (name.endsWith('.d.ts')) declarations.push(path);
});
visit(root);

const pattern = /(\bfrom\s+|\bimport\s*\(|\bimport\s+)(['"])(\.{1,2}\/[^'"]+)\2/g;
for (const path of declarations) {
  const source = readFileSync(path, 'utf8');
  const output = source.replace(pattern, (match, prefix, quote, specifier) => {
    if (/\.(?:[cm]?js|json|css)$/.test(specifier)) return match;
    const target = resolve(dirname(path), specifier);
    const fixed = existsSync(`${target}.d.ts`)
      ? `${specifier}.js`
      : existsSync(join(target, 'index.d.ts'))
        ? `${specifier}/index.js`
        : specifier;
    return `${prefix}${quote}${fixed}${quote}`;
  });
  if (output !== source) writeFileSync(path, output);
}
console.log(`Normalized ESM specifiers in ${declarations.length} declaration files`);
