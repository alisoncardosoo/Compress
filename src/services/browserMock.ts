import type { CompressApi } from '../types/electron';
import { defaultSettings } from '../utils/presets';

export const installBrowserMock = () => {
  if (window.compress) {
    return;
  }

  if (navigator.userAgent.includes('Electron')) {
    console.error('Compress preload API is unavailable in Electron.');
    return;
  }

  const noopDispose = () => () => undefined;
  const mock: CompressApi = {
    selectImages: async () => [],
    selectFolder: async () => [],
    importPaths: async () => [],
    chooseExportDirectory: async () => null,
    compressImages: async () => [],
    cancelCompression: async () => undefined,
    openFolder: async () => undefined,
    copyImage: async () => undefined,
    getPreferences: async () => ({ settings: defaultSettings, history: [] }),
    savePreferences: async () => undefined,
    onCompressionProgress: noopDispose,
    onOpenImagesShortcut: noopDispose,
    onExportShortcut: noopDispose,
    onPreferencesShortcut: noopDispose,
  };

  window.compress = mock;
};
