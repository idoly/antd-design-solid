import { compile, optimize } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';
import { gzipSync } from 'node:zlib';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, relative, resolve } from 'node:path';
import postcss from 'postcss';

const root = resolve(import.meta.dirname, '..');
const src = resolve(root, 'src');
const output = resolve(root, 'dist/styles');
const entryDirectory = resolve(src, 'entries');
const extensions = ['.ts', '.tsx'];
const styleOwners = {
  avatar: 'avatar',
  'border-beam': 'border-beam',
  button: 'button',
  card: 'card',
  col: 'grid',
  'date-picker': 'date-picker',
  'float-button': 'float-button',
  form: 'form',
  'input-wrapper': 'input',
  layout: 'layout',
  list: 'list',
  mentions: 'mentions',
  menu: 'menu',
  modal: 'modal',
  pagination: 'pagination',
  'range-picker': 'date-picker',
  row: 'grid',
  select: 'select',
  tabs: 'tabs',
};
const ownerPrefixes = Object.keys(styleOwners).sort((left, right) => right.length - left.length);

function resolveSourceImport(importer, specifier) {
  if (!specifier.startsWith('.')) return undefined;
  const unresolved = resolve(dirname(importer), specifier);
  const withoutJs = unresolved.replace(/\.js$/, '');
  const candidates = [unresolved, withoutJs, ...extensions.map((extension) => `${withoutJs}${extension}`), ...extensions.map((extension) => resolve(withoutJs, `index${extension}`))];
  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
}

function sourceGraph(entry) {
  const files = new Set();
  const visit = (file) => {
    if (files.has(file)) return;
    files.add(file);
    const source = readFileSync(file, 'utf8');
    const moduleStatement = /(?:^|\n)\s*(?:import|export)\s+(type\s+)?(?:[^;]*?\s+from\s+)?["']([^"']+)["']\s*;/g;
    for (const match of source.matchAll(moduleStatement)) {
      if (match[1]) continue;
      const dependency = resolveSourceImport(file, match[2]);
      if (dependency) visit(dependency);
    }
  };
  visit(entry);
  return [...files];
}

function componentDirectories(files) {
  return new Set(files.map((file) => relative(src, file).split('/')[0]).filter((name) => name && name !== 'entries'));
}

function ownersForNode(node) {
  const owners = new Set();
  const selectors = [];
  if (node.type === 'rule') selectors.push(node.selector);
  node.walkRules((rule) => { selectors.push(rule.selector); });
  for (const selector of selectors) {
    for (const match of selector.matchAll(/\.ads-([a-z][a-z0-9-]*)/g)) {
      const prefix = ownerPrefixes.find((candidate) => match[1] === candidate || match[1].startsWith(`${candidate}-`));
      if (prefix) owners.add(styleOwners[prefix]);
    }
  }
  if (node.toString().includes('ads-border-beam')) owners.add('border-beam');
  return owners;
}

const fullStyles = postcss.parse(readFileSync(resolve(src, 'styles.css'), 'utf8'));
const customRules = new Map();
for (const node of fullStyles.nodes) {
  if (node.type === 'atrule' && (node.name === 'import' || node.name === 'source')) continue;
  const owners = ownersForNode(node);
  if (owners.size === 0) throw new Error(`Cannot assign component style rule: ${node.toString().slice(0, 120)}`);
  for (const owner of owners) {
    const rules = customRules.get(owner) ?? [];
    rules.push(node.toString());
    customRules.set(owner, rules);
  }
}

const compileOptions = { base: root, onDependency() {} };
const baseSource = readFileSync(resolve(src, 'styles/base.css'), 'utf8');
const utilitySource = '@reference "./src/styles/base.css";\n@import "tailwindcss/utilities" source(none);';
const entries = readdirSync(entryDirectory).filter((name) => name.endsWith('.ts')).sort();
const commonThreshold = Number.parseInt(process.env.COMPONENT_STYLE_COMMON_THRESHOLD ?? '16', 10);

const plans = entries.map((entryName) => {
  const name = basename(entryName, extname(entryName));
  const files = sourceGraph(resolve(entryDirectory, entryName));
  const scanner = new Scanner({
    sources: files.map((file) => ({ base: dirname(file), pattern: basename(file), negated: false })),
  });
  const directories = componentDirectories(files);
  return {
    name,
    candidates: new Set(scanner.scan()),
    rules: [...directories].flatMap((directory) => customRules.get(directory) ?? []),
  };
});

const candidateFrequency = new Map();
for (const plan of plans) {
  for (const candidate of plan.candidates) candidateFrequency.set(candidate, (candidateFrequency.get(candidate) ?? 0) + 1);
}
const commonCandidates = new Set([...candidateFrequency].filter(([, count]) => count >= commonThreshold).map(([candidate]) => candidate));

const baseCompiler = await compile(baseSource, compileOptions);
const commonCompiler = await compile(utilitySource, compileOptions);
const baseCss = optimize(`${baseCompiler.build([])}\n${commonCompiler.build([...commonCandidates])}`, { file: 'base.css', minify: true }).code;
mkdirSync(output, { recursive: true });
writeFileSync(resolve(output, 'base.css'), baseCss);

const sizes = [];
for (const plan of plans) {
  const utilityCompiler = await compile(utilitySource, compileOptions);
  const localCandidates = [...plan.candidates].filter((candidate) => !commonCandidates.has(candidate));
  const utilities = utilityCompiler.build(localCandidates);
  const css = optimize(`${utilities}\n${plan.rules.join('\n')}`, { file: `${plan.name}.css`, minify: true }).code;
  writeFileSync(resolve(output, `${plan.name}.css`), css);
  sizes.push({ name: plan.name, raw: Buffer.byteLength(css), gzip: gzipSync(css).byteLength });
}

const baseGzip = gzipSync(baseCss).byteLength;
const sizeMap = new Map(sizes.map((size) => [size.name, size.gzip]));
const combinations = {
  action: ['button', 'tooltip', 'float-button'],
  fields: ['form', 'input', 'select', 'button'],
  dialog: ['modal', 'form', 'input', 'button'],
  data: ['table', 'pagination', 'dropdown'],
  scheduling: ['date-picker', 'tooltip', 'button'],
};
const combinationSizes = Object.entries(combinations).map(([name, components]) => ({
  name,
  gzip: baseGzip + components.reduce((sum, component) => sum + (sizeMap.get(component) ?? 0), 0),
}));
const largest = sizes.toSorted((left, right) => right.gzip - left.gzip).slice(0, 5);
console.log(`Generated ${sizes.length} component styles with ${commonCandidates.size} shared candidates at threshold ${commonThreshold}.`);
console.log(`Base: ${baseCss.length} bytes (${baseGzip} B gzip).`);
console.log(`Largest component styles (gzip): ${largest.map(({ name, gzip }) => `${name} ${gzip} B`).join(', ')}.`);
console.log(`Combination budgets (gzip): ${combinationSizes.map(({ name, gzip }) => `${name} ${gzip} B`).join(', ')}.`);
