import { execFile } from 'node:child_process';
import { constants } from 'node:fs';
import { access, mkdir, rm, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

const lightSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" rx="230" fill="url(#paint0_linear)"/>
  <rect x="174" y="214" width="676" height="596" rx="152" fill="white" fill-opacity="0.86"/>
  <path d="M326 610L438 486C463 458 507 459 531 489L574 543L610 501C635 472 681 476 700 510L764 624C782 655 759 694 723 694H306C269 694 248 652 273 625L326 610Z" fill="#0071E3"/>
  <circle cx="672" cy="372" r="64" fill="#34C759"/>
  <path d="M322 315H520" stroke="#0071E3" stroke-width="52" stroke-linecap="round"/>
  <path d="M322 410H450" stroke="#0071E3" stroke-width="52" stroke-linecap="round" opacity="0.55"/>
  <defs>
    <linearGradient id="paint0_linear" x1="164" y1="80" x2="860" y2="944" gradientUnits="userSpaceOnUse">
      <stop stop-color="#EAF4FF"/>
      <stop offset="0.48" stop-color="#F5F5F7"/>
      <stop offset="1" stop-color="#BBD9FF"/>
    </linearGradient>
  </defs>
</svg>`;

const darkSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" rx="230" fill="url(#paint0_linear_dark)"/>
  <rect x="174" y="214" width="676" height="596" rx="152" fill="#11131A" fill-opacity="0.92"/>
  <path d="M326 610L438 486C463 458 507 459 531 489L574 543L610 501C635 472 681 476 700 510L764 624C782 655 759 694 723 694H306C269 694 248 652 273 625L326 610Z" fill="#4DA3FF"/>
  <circle cx="672" cy="372" r="64" fill="#30D158"/>
  <path d="M322 315H520" stroke="#4DA3FF" stroke-width="52" stroke-linecap="round"/>
  <path d="M322 410H450" stroke="#4DA3FF" stroke-width="52" stroke-linecap="round" opacity="0.62"/>
  <defs>
    <linearGradient id="paint0_linear_dark" x1="120" y1="64" x2="900" y2="960" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0E172D"/>
      <stop offset="0.48" stop-color="#101623"/>
      <stop offset="1" stop-color="#1F2F52"/>
    </linearGradient>
  </defs>
</svg>`;

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
    svg: lightSvg,
    iconset: 'build/ImageShrink.iconset',
    svgPath: 'build/icon.svg',
    icnsPath: 'build/icon.icns',
  },
  {
    name: 'dark',
    svg: darkSvg,
    iconset: 'build/ImageShrink-dark.iconset',
    svgPath: 'build/icon-dark.svg',
    icnsPath: 'build/icon-dark.icns',
  },
];

for (const variant of iconVariants) {
  await rm(variant.iconset, { recursive: true, force: true });
  await mkdir(variant.iconset, { recursive: true });
  await writeFile(variant.svgPath, variant.svg.trim());

  await Promise.all(
    sizes.map(([name, size]) =>
      sharp(Buffer.from(variant.svg))
        .resize(Number(size), Number(size))
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
