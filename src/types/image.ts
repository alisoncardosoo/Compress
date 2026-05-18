export type OutputFormat = 'jpg' | 'png' | 'webp' | 'avif';

export type ProcessingStatus = 'idle' | 'queued' | 'processing' | 'done' | 'error' | 'cancelled';

export type CompressionPreset = 'smart' | 'web' | 'instagram' | 'whatsapp' | 'ultra' | 'quality';

export interface ResizeSettings {
  mode: 'keep' | 'auto';
  maxWidth: number;
}

export interface CompressionSettings {
  quality: number;
  outputFormat: OutputFormat;
  keepExif: boolean;
  overwriteOriginal: boolean;
  smartCompression: boolean;
  preset: CompressionPreset;
  resize: ResizeSettings;
}

export interface ImageFile {
  id: string;
  path: string;
  name: string;
  extension: string;
  format: string;
  size: number;
  width: number;
  height: number;
  thumbnail: string;
  status: ProcessingStatus;
  progress: number;
  outputPath?: string;
  outputSize?: number;
  error?: string;
}

export interface CompressionResult {
  id: string;
  outputPath: string;
  outputSize: number;
  status: ProcessingStatus;
  error?: string;
}

export interface CompressionProgress {
  id: string;
  status: ProcessingStatus;
  progress: number;
  outputPath?: string;
  outputSize?: number;
  error?: string;
}

export interface HistoryItem {
  id: string;
  completedAt: string;
  fileCount: number;
  originalBytes: number;
  outputBytes: number;
  outputDirectory: string;
  settings: CompressionSettings;
}

export interface AppPreferences {
  settings: CompressionSettings;
  history: HistoryItem[];
}
