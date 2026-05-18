import { execFile } from 'node:child_process';
import { cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import packageJson from '../package.json' with { type: 'json' };

const execFileAsync = promisify(execFile);

const root = process.cwd();
const releaseDir = path.join(root, 'release');
const sourceApp = path.join(releaseDir, 'mac-arm64', 'Compress.app');
const targetApp = path.join(releaseDir, 'Compress.app');
const sourceDmg = path.join(releaseDir, `Compress-${packageJson.version}-arm64.dmg`);
const targetDmg = path.join(releaseDir, 'Compress.dmg');
const targetZip = path.join(releaseDir, 'Compress.zip');

await rm(targetApp, { recursive: true, force: true });
await rm(targetZip, { force: true });

await cp(sourceApp, targetApp, { recursive: true });
await cp(sourceDmg, targetDmg, { force: true });

await execFileAsync('ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', targetApp, targetZip]);
