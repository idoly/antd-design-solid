import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import vm from 'node:vm';

const archive = process.argv[2] ?? '/tmp/antd-6.5.2.tgz';
const listing = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' });
const names = [...listing.matchAll(/^package\/es\/locale\/([A-Za-z_]+)\.js$/gm)]
  .map((match) => match[1])
  .filter((name) => !['context', 'index', 'useLocale', 'en_US', 'zh_CN'].includes(name))
  .sort();
const fields = ['global', 'Table', 'Modal', 'Tour', 'Popconfirm', 'Transfer', 'Upload', 'Empty', 'QRCode', 'ColorPicker', 'Text', 'Form'];
const cache = new Map();
const componentCache = new Map();

function loadComponentLocale(component, name) {
  const key = `${component}/${name}`;
  if (componentCache.has(key)) return componentCache.get(key);
  if (!listing.includes(`package/es/${component}/locale/${name}.js`)) return loadComponentLocale(component, 'en_US');
  let source = execFileSync('tar', ['-xOf', archive, `package/es/${component}/locale/${name}.js`], { encoding: 'utf8' });
  const imports = [...source.matchAll(/^import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"];$/gm)];
  const context = {};
  for (const [, identifier, specifier] of imports) {
    if (specifier.includes('time-picker/locale/')) context[identifier] = loadComponentLocale('time-picker', specifier.split('/').at(-1));
    else if (specifier.startsWith('./')) context[identifier] = loadComponentLocale(component, specifier.slice(2));
    else context[identifier] = {};
  }
  source = source.replace(/^import .*;$/gm, '').replace(/export default ([A-Za-z_$][\w$]*);?/, '$1');
  const value = vm.runInNewContext(source, context);
  componentCache.set(key, value);
  return value;
}

function loadLocale(name) {
  if (cache.has(name)) return cache.get(name);
  let source = execFileSync('tar', ['-xOf', archive, `package/es/locale/${name}.js`], { encoding: 'utf8' });
  const imports = [...source.matchAll(/^import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"];$/gm)];
  const context = {};
  for (const [, identifier, specifier] of imports) context[identifier] = specifier.startsWith('./') ? loadLocale(specifier.slice(2)) : {};
  source = source.replace(/^import .*;$/gm, '').replace(/export default localeValues;?/, 'localeValues');
  const value = vm.runInNewContext(source, context);
  cache.set(name, value);
  return value;
}

for (const name of names) {
  const value = loadLocale(name);
  const locale = { locale: value.locale ?? name.replace('_', '-').toLowerCase() };
  for (const field of fields) if (value[field]) locale[field] = value[field];
  const datePicker = loadComponentLocale('date-picker', name);
  const timePicker = loadComponentLocale('time-picker', name);
  locale.DatePicker = { placeholder: datePicker.lang?.placeholder, rangePlaceholder: datePicker.lang?.rangePlaceholder };
  locale.TimePicker = { placeholder: timePicker.placeholder, rangePlaceholder: timePicker.rangePlaceholder };
  const path = resolve(`src/locale/${name}/index.ts`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `import type { Locale } from '../types';\n\nconst locale: Locale = ${JSON.stringify(locale, null, 2)};\n\nexport default locale;\n`);
}

console.log(`Generated ${names.length} locale packs from ${archive}`);
