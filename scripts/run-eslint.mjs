import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = new URL('../', import.meta.url);
const srcDir = new URL('../src/', import.meta.url);
const filePattern = /\.(ts|tsx|js|jsx|mjs|cjs)$/;
const blockedPatterns = [
  { regex: /<<<<<<<|=======|>>>>>>>/m, message: 'merge conflict markers found' },
  { regex: /\bdebugger\b/, message: 'debugger statement found' },
  { regex: /console\.log\(/, message: 'console.log found' },
];

const collectFiles = async (directoryUrl) => {
  const entries = await fs.readdir(directoryUrl, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directoryUrl);
      if (entry.isDirectory()) {
        return collectFiles(entryUrl);
      }
      return filePattern.test(entry.name) ? [entryUrl] : [];
    }),
  );

  return files.flat();
};

const files = await collectFiles(srcDir);
const failures = [];

for (const fileUrl of files) {
  const contents = await fs.readFile(fileUrl, 'utf8');
  for (const pattern of blockedPatterns) {
    if (pattern.regex.test(contents)) {
      failures.push(`${path.relative(rootDir.pathname, fileUrl.pathname)}: ${pattern.message}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Lint checks failed:\n');
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Lint checks passed for ${files.length} files.`);
}
