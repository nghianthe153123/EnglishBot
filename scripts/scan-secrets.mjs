import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ignoredDirectories = new Set([
  '.git',
  '.cache',
  'coverage',
  'dist',
  'node_modules',
  'target',
]);

const forbiddenTrackedFiles = /(^|\/)(?:\.env(?:\..+)?|credentials\.json)$/u;
const allowedTrackedFiles = new Set(['.env.example']);

const patterns = [
  { name: 'private key', expression: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u },
  { name: 'OpenAI-style key', expression: /\bsk-[A-Za-z0-9_-]{20,}\b/u },
  { name: 'GitHub token', expression: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/u },
  { name: 'AWS access key', expression: /\bAKIA[0-9A-Z]{16}\b/u },
];

function walkFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      return [];
    }

    const absolutePath = resolve(directory, entry.name);
    return entry.isDirectory() ? walkFiles(absolutePath) : [absolutePath];
  });
}

function listFiles(rootDirectory) {
  try {
    const output = execFileSync('git', ['ls-files', '-z'], {
      cwd: rootDirectory,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const trackedFiles = output
      .split('\0')
      .filter(Boolean)
      .map((path) => resolve(rootDirectory, path));
    return trackedFiles.length > 0 ? trackedFiles : walkFiles(rootDirectory);
  } catch {
    return walkFiles(rootDirectory);
  }
}

export function scanSecrets(rootDirectory) {
  const findings = [];
  const files = listFiles(rootDirectory);

  for (const file of files) {
    const relativePath = relative(rootDirectory, file).replaceAll('\\', '/');
    if (allowedTrackedFiles.has(relativePath)) {
      continue;
    }

    if (forbiddenTrackedFiles.test(relativePath)) {
      findings.push(`${relativePath}: file nhạy cảm không được phép track`);
      continue;
    }

    if (statSync(file).size > 1_000_000) {
      continue;
    }

    let content;
    try {
      content = readFileSync(file, 'utf8');
    } catch {
      continue;
    }

    for (const pattern of patterns) {
      if (pattern.expression.test(content)) {
        findings.push(`${relativePath}: phát hiện mẫu ${pattern.name}`);
      }
    }
  }

  return { checkedFiles: files.length, findings };
}

function argumentValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const isDirectExecution =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectExecution) {
  const rootDirectory = resolve(argumentValue('--root', '.'));
  const result = scanSecrets(rootDirectory);

  if (result.findings.length > 0) {
    console.error(`Quét secret thất bại (${result.findings.length} phát hiện):`);
    for (const finding of result.findings) {
      console.error(`- ${finding}`);
    }
    process.exitCode = 1;
  } else {
    console.log(`Quét secret đạt: ${result.checkedFiles} file.`);
  }
}
