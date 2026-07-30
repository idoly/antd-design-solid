import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const version = process.argv[2] ?? '6.5.2';
const components = [
  ['Table', 'src/table/Table.tsx'],
  ['Form', 'src/form/Form.tsx'],
  ['Select', 'src/select/Select.tsx'],
  ['Tree', 'src/tree/Tree.tsx'],
  ['TreeSelect', 'src/tree-select/TreeSelect.tsx'],
  ['Upload', 'src/upload/Upload.tsx'],
  ['DatePicker', 'src/date-picker/DatePicker.tsx'],
  ['ConfigProvider', 'src/config-provider/ConfigProvider.tsx'],
  ['Modal', 'src/modal/Modal.tsx'],
  ['Input', 'src/input/Input.tsx'],
  ['Menu', 'src/menu/Menu.tsx'],
];

console.log(`Ant Design explicit prop audit against ${version}`);
console.log('Component\tOfficial\tExplicit\tCandidates');
for (const [component, sourcePath] of components) {
  const output = execFileSync('npx', ['--yes', `@ant-design/cli@${version}`, '--format', 'json', '--version', version, '--detail', 'info', component], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
  const api = JSON.parse(output);
  const source = readFileSync(sourcePath, 'utf8');
  const names = (api.props ?? []).map((prop) => prop.name).filter((name) => /^[A-Za-z][\w]*$/.test(name));
  const candidates = names.filter((name) => !new RegExp(`\\b${name}\\?\\s*:`).test(source));
  console.log(`${component}\t${names.length}\t${names.length - candidates.length}\t${candidates.join(', ') || '-'}`);
}
console.log('\nExplicit counts are a lower bound. Inherited JSX attributes, aliases, ref methods, and React-only props require manual classification.');
