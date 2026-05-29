import { execFile } from 'node:child_process';
import { constants } from 'node:fs';
import { access, mkdir, readFile, rm } from 'node:fs/promises';
import { promisify } from 'node:util';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

// Source artwork for the app icon. The same image is used for the light and
// dark variants so the dock/DMG icon stays identical regardless of theme.
const sourcePath = 'build/icon-source.png';
const sourceBuffer = await readFile(sourcePath);

const sizes = [
  ['icon_16x16.png', 16],
  ['icon_16x16@2x.png', 32],
  ['icon_32x32.png', 32],
  ['icon_32x32@2x.png', 64],
  ['icon_128x128.png', 128],
  ['icon_128x128@2x.png', 256],
  ['icon_256x256.png', 256],
  ['icon_256x256@2x.png', 512],
  ['icon_512x512.png', 512],
  ['icon_512x512@2x.png', 1024],
];

await mkdir('build', { recursive: true });

const iconVariants = [
  {
    name: 'light',
    iconset: 'build/ImageShrink.iconset',
    icnsPath: 'build/icon.icns',
  },
  {
    name: 'dark',
    iconset: 'build/ImageShrink-dark.iconset',
    icnsPath: 'build/icon-dark.icns',
  },
];

for (const variant of iconVariants) {
  await rm(variant.iconset, { recursive: true, force: true });
  await mkdir(variant.iconset, { recursive: true });

  await Promise.all(
    sizes.map(([name, size]) =>
      sharp(sourceBuffer)
        .resize(Number(size), Number(size), { fit: 'cover' })
        .png()
        .toFile(`${variant.iconset}/${name}`),
    ),
  );

  try {
    await execFileAsync('iconutil', ['-c', 'icns', variant.iconset, '-o', variant.icnsPath]);
  } catch (error) {
    try {
      await access(variant.icnsPath, constants.R_OK);
      console.warn(`iconutil failed for ${variant.name}; reusing existing ${variant.icnsPath}.`);
    } catch {
      throw error;
    }
  }
}
