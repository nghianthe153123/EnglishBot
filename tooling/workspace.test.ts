import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repositoryRoot = resolve(import.meta.dirname, '..');

const requiredPaths = [
  'apps/extension/package.json',
  'apps/web/package.json',
  'backend/application/pom.xml',
  'backend/platform/pom.xml',
  'docs/decisions/ADR-005-repository-build-layout.md',
  'packages/api-contracts/package.json',
  'packages/mock-fixtures/package.json',
  'packages/ui/package.json',
  'pom.xml',
  'pnpm-workspace.yaml',
  'tsconfig.json',
] as const;

describe('cấu trúc workspace EnglishBot', () => {
  it.each(requiredPaths)('có file bắt buộc %s', (relativePath) => {
    expect(existsSync(resolve(repositoryRoot, relativePath))).toBe(true);
  });

  it('không có package TypeScript trùng tên', () => {
    const packagePaths = requiredPaths.filter((path) => path.endsWith('package.json'));
    const packageNames = packagePaths.map((path) => {
      const contents = readFileSync(resolve(repositoryRoot, path), 'utf8');
      return (JSON.parse(contents) as { name: string }).name;
    });

    expect(new Set(packageNames).size).toBe(packageNames.length);
  });
});
