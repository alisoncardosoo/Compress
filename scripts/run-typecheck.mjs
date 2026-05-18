import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = new URL('../', import.meta.url);
const srcDir = new URL('../src/', import.meta.url);
const rootPath = fileURLToPath(rootDir);
const tsconfigFiles = ['tsconfig.json', 'tsconfig.electron.json'];
const sourcePattern = /\.(ts|tsx)$/;
const importPattern = /\b(?:import|export)\b[\s\S]*?\bfrom\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
const resolveExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.d.ts'];

const collectFiles = async (directoryUrl) => {
  const entries = await fs.readdir(directoryUrl, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directoryUrl);
      if (entry.isDirectory()) {
        return collectFiles(entryUrl);
      }
      return sourcePattern.test(entry.name) ? [entryUrl] : [];
    }),
  );

  return files.flat();
};

const fileExists = async (targetPath) => {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const resolveImport = async (fromPath, specifier) => {
  const basePath = path.resolve(path.dirname(fromPath), specifier);
  const extensionlessBase = basePath.replace(/\.(js|jsx|mjs|cjs)$/, '');
  const candidates = [
    basePath,
    ...resolveExtensions.map((extension) => `${basePath}${extension}`),
    ...resolveExtensions.map((extension) => path.join(basePath, `index${extension}`)),
    extensionlessBase,
    ...resolveExtensions.map((extension) => `${extensionlessBase}${extension}`),
    ...resolveExtensions.map((extension) => path.join(extensionlessBase, `index${extension}`)),
  ];

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return true;
    }
  }

  return false;
};

const errors = [];

for (const configFile of tsconfigFiles) {
  const configPath = path.join(rootPath, configFile);
  if (!(await fileExists(configPath))) {
    errors.push(`${configFile}: missing configuration file`);
  }
}

const sourceFiles = await collectFiles(srcDir);

for (const fileUrl of sourceFiles) {
  const filePath = fileURLToPath(fileUrl);
  const contents = await fs.readFile(fileUrl, 'utf8');
  const matches = contents.matchAll(importPattern);

  for (const match of matches) {
    const specifier = match[1] ?? match[2];
    if (!specifier || !specifier.startsWith('.')) {
      continue;
    }

    if (!(await resolveImport(filePath, specifier))) {
      errors.push(`${path.relative(rootPath, filePath)}: unresolved import "${specifier}"`);
    }
  }
}

if (errors.length > 0) {
  console.error('Type checks failed:\n');
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Type checks passed for ${sourceFiles.length} files.`);
}
