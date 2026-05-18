import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'src', 'electron', 'preload.cjs');
const targetDirectory = path.join(root, 'dist-electron', 'electron');
const target = path.join(targetDirectory, 'preload.cjs');

await mkdir(targetDirectory, { recursive: true });
await cp(source, target);
