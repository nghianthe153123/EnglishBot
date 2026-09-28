import { spawnSync } from 'node:child_process';

const isWindows = process.platform === 'win32';

const commands = [
  [isWindows ? 'pnpm.cmd' : 'pnpm', ['install', '--frozen-lockfile']],
  [isWindows ? 'pnpm.cmd' : 'pnpm', ['run', 'quality']],
  ['node', ['scripts/check-docs.mjs']],
  ['node', ['scripts/scan-secrets.mjs']],
  [isWindows ? 'mvnw.cmd' : './mvnw', ['--batch-mode', '--no-transfer-progress', 'verify']],
];

for (const [command, args] of commands) {
  console.log(`\n> ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { shell: isWindows, stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('\nToàn bộ cổng repository đã đạt.');
