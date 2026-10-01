import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Vite is locked through Vitest; clean pnpm checkouts need not expose a root .bin/vite.
const require = createRequire(import.meta.url);
const vitestRequire = createRequire(require.resolve('vitest/package.json'));
const packagePath = vitestRequire.resolve('vite/package.json');
const metadata = JSON.parse(readFileSync(packagePath, 'utf8'));
if (metadata.version !== '8.3.1' || metadata.bin?.vite !== 'bin/vite.js') {
  throw new Error(
    'Tooling mock không khớp Vite 8.3.1 đã khóa; cần review ADR-009, không tự fallback.',
  );
}
if (process.argv[2] === '--check') {
  console.log('Mock tooling: Vite 8.3.1 từ dependency Vitest đã khóa.');
} else {
  const cli = resolve(dirname(packagePath), metadata.bin.vite);
  process.argv[1] = cli;
  await import(pathToFileURL(cli).href);
}
