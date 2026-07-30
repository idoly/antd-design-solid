import { spawnSync } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(npm, ['test'], { encoding: 'utf8', env: process.env });
const stdout = result.stdout ?? '';
const stderr = result.stderr ?? '';
process.stdout.write(stdout);
process.stderr.write(stderr);

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const diagnostics = ['STRICT_READ_UNTRACKED', 'NO_OWNER_EFFECT'];
const found = diagnostics.filter((diagnostic) => stdout.includes(diagnostic) || stderr.includes(diagnostic));
if (found.length) {
  console.error(`Solid strict diagnostics detected: ${found.join(', ')}`);
  process.exit(1);
}

console.log('Solid strict diagnostics: 0');
