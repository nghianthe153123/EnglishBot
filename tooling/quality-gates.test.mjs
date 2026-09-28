import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkDocumentation } from '../scripts/check-docs.mjs';
import { scanSecrets } from '../scripts/scan-secrets.mjs';

const temporaryDirectories = [];

function createFixture() {
  const directory = mkdtempSync(join(tmpdir(), 'englishbot-quality-'));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('cổng tài liệu', () => {
  it('chấp nhận liên kết nội bộ hợp lệ', () => {
    const root = createFixture();
    mkdirSync(join(root, 'docs'));
    writeFileSync(join(root, 'README.md'), '# Fixture\n\n[Chi tiết](docs/detail.md)\n');
    writeFileSync(join(root, 'docs', 'detail.md'), '# Chi tiết\n');

    expect(checkDocumentation(root).errors).toEqual([]);
  });

  it('trả lỗi cho liên kết hỏng có kiểm soát', () => {
    const root = createFixture();
    writeFileSync(join(root, 'README.md'), '# Fixture\n\n[Hỏng](missing.md)\n');

    expect(checkDocumentation(root).errors).toHaveLength(1);
  });
});

describe('cổng secret', () => {
  it('chấp nhận giá trị giả an toàn', () => {
    const root = createFixture();
    writeFileSync(join(root, 'config.txt'), 'OPENAI_API_KEY=not-configured\n');

    expect(scanSecrets(root).findings).toEqual([]);
  });

  it('trả lỗi cho mẫu private key có kiểm soát', () => {
    const root = createFixture();
    const unsafeValue = ['-----BEGIN', 'PRIVATE KEY-----'].join(' ');
    writeFileSync(join(root, 'unsafe.txt'), `${unsafeValue}\n`);

    expect(scanSecrets(root).findings).toHaveLength(1);
  });
});
