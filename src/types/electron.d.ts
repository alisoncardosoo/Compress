import type {
  AppPreferences,
  CompressionProgress,
  CompressionResult,
  CompressionSettings,
  ImageFile,
} from './image';

export interface CompressApi {
  selectImages: () => Promise<ImageFile[]>;
  selectFolder: () => Promise<ImageFile[]>;
  importPaths: (paths: string[]) => Promise<ImageFile[]>;
  chooseExportDirectory: () => Promise<string | null>;
  compressImages: (files: ImageFile[], settings: CompressionSettings, exportDirectory?: string) => Promise<CompressionResult[]>;
  cancelCompression: () => Promise<void>;
  openFolder: (path: string) => Promise<void>;
  copyImage: (path: string) => Promise<void>;
  getPreferences: () => Promise<AppPreferences>;
  savePreferences: (preferences: AppPreferences) => Promise<void>;
  onCompressionProgress: (callback: (progress: CompressionProgress) => void) => () => void;
  onOpenImagesShortcut: (callback: () => void) => () => void;
  onExportShortcut: (callback: () => void) => () => void;
  onPreferencesShortcut: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    compress: CompressApi;
  }
}
