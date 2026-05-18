import type { CompressionPreset, CompressionSettings } from '../types/image.js';

export const defaultSettings: CompressionSettings = {
  quality: 82,
  outputFormat: 'webp',
  keepExif: false,
  overwriteOriginal: false,
  smartCompression: true,
  preset: 'smart',
  resize: {
    mode: 'keep',
    maxWidth: 1920,
  },
};

export const applyPreset = (preset: CompressionPreset, current: CompressionSettings): CompressionSettings => {
  const base = { ...current, preset };

  const presets: Record<CompressionPreset, CompressionSettings> = {
    smart: { ...base, quality: 82, outputFormat: 'webp', smartCompression: true, resize: { mode: 'keep', maxWidth: 1920 } },
    web: { ...base, quality: 76, outputFormat: 'webp', smartCompression: true, resize: { mode: 'auto', maxWidth: 1600 } },
    instagram: { ...base, quality: 84, outputFormat: 'jpg', smartCompression: true, resize: { mode: 'auto', maxWidth: 1440 } },
    whatsapp: { ...base, quality: 68, outputFormat: 'jpg', smartCompression: true, resize: { mode: 'auto', maxWidth: 1280 } },
    ultra: { ...base, quality: 46, outputFormat: 'webp', smartCompression: true, resize: { mode: 'auto', maxWidth: 1200 } },
    quality: { ...base, quality: 94, outputFormat: 'jpg', smartCompression: false, resize: { mode: 'keep', maxWidth: 2400 } },
  };

  return presets[preset];
};
