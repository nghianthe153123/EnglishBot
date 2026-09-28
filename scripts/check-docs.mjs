import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ignoredDirectories = new Set([
  '.git',
  '.cache',
  'coverage',
  'dist',
  'node_modules',
  'target',
]);

function listMarkdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      return [];
    }

    const absolutePath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      return listMarkdownFiles(absolutePath);
    }

    return extname(entry.name).toLowerCase() === '.md' ? [absolutePath] : [];
  });
}

function normalizeLinkTarget(rawTarget) {
  const withoutTitle = rawTarget
    .trim()
    .replace(/^<|>$/g, '')
    .split(/\s+["']/u, 1)[0];
  return decodeURIComponent(withoutTitle.split('#', 1)[0].split('?', 1)[0]);
}

export function checkDocumentation(rootDirectory) {
  const errors = [];
  const markdownFiles = listMarkdownFiles(rootDirectory);

  for (const markdownFile of markdownFiles) {
    const content = readFileSync(markdownFile, 'utf8');
    const relativePath = relative(rootDirectory, markdownFile).replaceAll('\\', '/');

    if (!/^#\s+\S/mu.test(content)) {
      errors.push(`${relativePath}: thiếu tiêu đề cấp 1`);
    }

    for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/gu)) {
      const rawTarget = match[1];
      if (!rawTarget || /^(?:https?:|mailto:|#)/u.test(rawTarget)) {
        continue;
      }

      const target = normalizeLinkTarget(rawTarget);
      if (!target) {
        continue;
      }

      const absoluteTarget = resolve(dirname(markdownFile), target);
      if (!existsSync(absoluteTarget)) {
        errors.push(`${relativePath}: liên kết không tồn tại -> ${rawTarget}`);
      }
    }
  }

  return { checkedFiles: markdownFiles.length, errors };
}

function argumentValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const isDirectExecution =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectExecution) {
  const rootDirectory = resolve(argumentValue('--root', '.'));
  const result = checkDocumentation(rootDirectory);

  if (result.errors.length > 0) {
    console.error(`Kiểm tra tài liệu thất bại (${result.errors.length} lỗi):`);
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
  } else {
    console.log(`Kiểm tra tài liệu đạt: ${result.checkedFiles} file Markdown.`);
  }
}
