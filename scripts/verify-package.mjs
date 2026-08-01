import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const packageName = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).name;

function bundledGraph(entry) {
  const visited = new Set();
  const visit = (file) => {
    if (visited.has(file) || !existsSync(file)) return;
    visited.add(file);
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)) {
      if (!match[1].startsWith('.')) continue;
      visit(resolve(file, '..', match[1]));
    }
  };
  visit(entry);
  return [...visited];
}

for (const target of ['dist/entries/button.js', 'dist/ssr/entries/button.js']) {
  const graph = bundledGraph(resolve(root, target));
  if (graph.length < 2) throw new Error(`${target} does not resolve to a component chunk`);
  const source = graph.map((file) => readFileSync(file, 'utf8')).join('\n');
  if (/from\s*["'](?:dayjs|qrcode)["']/.test(source) || graph.some((file) => /(?:QRCode|dayjs)/.test(file))) {
    throw new Error(`${target} unexpectedly includes DatePicker or QRCode dependencies`);
  }
}

const removedFullStyle = resolve(root, 'dist/ant-design-solid.css');
const baseStyle = resolve(root, 'dist/styles/base.css');
const buttonStyle = resolve(root, 'dist/styles/button.css');
if (existsSync(removedFullStyle)) throw new Error('aggregate stylesheet should not be published');
if (![baseStyle, buttonStyle].every(existsSync)) throw new Error('component style outputs are missing');
const buttonCss = readFileSync(buttonStyle, 'utf8');
if (buttonCss.includes('@layer base')) throw new Error('component style duplicates the shared base layer');
if (!buttonCss.includes('.ads-button') || buttonCss.includes('.ads-select')) throw new Error('Button component style ownership is invalid');
const styleGzip = (name) => gzipSync(readFileSync(resolve(root, `dist/styles/${name}.css`))).byteLength;
const baseGzip = gzipSync(readFileSync(baseStyle)).byteLength;
const styleBudget = (name, components, maximum) => {
  const size = baseGzip + components.reduce((sum, component) => sum + styleGzip(component), 0);
  if (size > maximum) throw new Error(`${name} style budget exceeded: ${size} > ${maximum} bytes gzip`);
};
if (baseGzip > 3_500) throw new Error(`Base style budget exceeded: ${baseGzip} bytes gzip`);
styleBudget('Button', ['button'], 5_000);
styleBudget('Action controls', ['button', 'tooltip', 'float-button'], 7_000);
styleBudget('Fields', ['form', 'input', 'select', 'button'], 10_000);
styleBudget('Dialog form', ['modal', 'form', 'input', 'button'], 10_000);
styleBudget('Data display', ['table', 'pagination', 'dropdown'], 10_500);
styleBudget('Scheduling', ['date-picker', 'tooltip', 'button'], 6_500);

const packed = JSON.parse(execFileSync('npm', ['pack', '--json'], { cwd: root, encoding: 'utf8' }));
const metadata = Array.isArray(packed) ? packed[0] : Object.values(packed)[0];
if (!metadata?.filename) throw new Error('npm pack did not return a tarball filename');

const tarball = join(root, metadata.filename);
const consumer = mkdtempSync(join(tmpdir(), 'ant-design-solid-consumer-'));
try {
  writeFileSync(join(consumer, 'package.json'), JSON.stringify({ name: 'consumer', private: true, type: 'module' }, null, 2));
  execFileSync('npm', ['install', '--legacy-peer-deps', tarball, 'solid-js@2.0.0-beta.27', '@solidjs/web@2.0.0-beta.27'], { cwd: consumer, stdio: 'inherit' });
  writeFileSync(join(consumer, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'NodeNext', moduleResolution: 'NodeNext', strict: true, skipLibCheck: true, noEmit: true }, include: ['consumer.ts'] }, null, 2));
  writeFileSync(join(consumer, 'consumer.ts'), `
import type { ButtonProps, DatePickerProps, SelectProps, TableRef, TreeProps } from '${packageName}';
import type { Locale } from '${packageName}/locale';
import enUS from '${packageName}/locale/en_US';
const button: ButtonProps = { type: 'primary' };
const date: DatePickerProps = { multiple: true, showWeek: true };
const select: SelectProps = { virtual: true };
const tree: TreeProps = { virtual: true, height: 240 };
const locale: Locale = enUS;
let table: TableRef | undefined;
void [button, date, select, tree, locale, table];
`);
  execFileSync(join(root, 'node_modules/.bin/tsc'), ['-p', join(consumer, 'tsconfig.json')], { cwd: consumer, stdio: 'inherit' });
  writeFileSync(join(consumer, 'runtime.mjs'), `
import { Button, DatePicker, Select, Table, Tree, theme, version } from '${packageName}';
import enUS from '${packageName}/locale/en_US';
if (![Button, DatePicker, Select, Table, Tree].every((value) => typeof value === 'function')) throw new Error('root component export missing');
if (!theme.getDesignToken || !version || !enUS.DatePicker) throw new Error('utility or locale export missing');
const buttonStyle = import.meta.resolve('${packageName}/button/style.css');
const baseStyle = import.meta.resolve('${packageName}/base.css');
if (!buttonStyle.endsWith('/dist/styles/button.css') || !baseStyle.endsWith('/dist/styles/base.css')) throw new Error('component style export missing');
console.log(JSON.stringify({ version, primary: theme.getDesignToken().colorPrimary }));
`);
  execFileSync('node', ['runtime.mjs'], { cwd: consumer, stdio: 'inherit' });
  const manifest = JSON.parse(readFileSync(join(consumer, 'node_modules', ...packageName.split('/'), 'package.json'), 'utf8'));
  if (manifest.exports?.['./styles.css'] || manifest.exports?.['./reset.css'] || manifest.exports?.['./style']) throw new Error('removed aggregate style export is still published');
  if (!manifest.exports?.['./base.css'] || !manifest.exports?.['./*/style.css'] || !manifest.exports?.['./*']) throw new Error('required package exports missing');
  console.log(`Verified ${metadata.name}@${metadata.version}: ${metadata.files.length} files, ${metadata.size} bytes packed`);
} finally {
  rmSync(consumer, { recursive: true, force: true });
  rmSync(tarball, { force: true });
}
