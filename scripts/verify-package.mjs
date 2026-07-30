import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
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
import type { ButtonProps, DatePickerProps, SelectProps, TableRef, TreeProps } from 'ant-design-solid';
import type { Locale } from 'ant-design-solid/locale';
import enUS from 'ant-design-solid/locale/en_US';
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
import { Button, DatePicker, Select, Table, Tree, theme, version } from 'ant-design-solid';
import enUS from 'ant-design-solid/locale/en_US';
if (![Button, DatePicker, Select, Table, Tree].every((value) => typeof value === 'function')) throw new Error('root component export missing');
if (!theme.getDesignToken || !version || !enUS.DatePicker) throw new Error('utility or locale export missing');
console.log(JSON.stringify({ version, primary: theme.getDesignToken().colorPrimary }));
`);
  execFileSync('node', ['runtime.mjs'], { cwd: consumer, stdio: 'inherit' });
  const manifest = JSON.parse(readFileSync(join(consumer, 'node_modules/ant-design-solid/package.json'), 'utf8'));
  if (!manifest.exports?.['./styles.css'] || !manifest.exports?.['./*']) throw new Error('required package exports missing');
  console.log(`Verified ${metadata.name}@${metadata.version}: ${metadata.files.length} files, ${metadata.size} bytes packed`);
} finally {
  rmSync(consumer, { recursive: true, force: true });
  rmSync(tarball, { force: true });
}
