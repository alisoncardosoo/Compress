import { create } from 'zustand';
import type { AppPreferences, CompressionProgress, CompressionSettings, HistoryItem, ImageFile } from '../types/image';
import { defaultSettings } from '../utils/presets';

interface ImageState {
  files: ImageFile[];
  settings: CompressionSettings;
  history: HistoryItem[];
  exportDirectory: string | null;
  isProcessing: boolean;
  startedAt: number | null;
  setFiles: (files: ImageFile[]) => void;
  addFiles: (files: ImageFile[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateSettings: (settings: CompressionSettings) => void;
  updateProgress: (progress: CompressionProgress) => void;
  setExportDirectory: (directory: string | null) => void;
  setProcessing: (isProcessing: boolean) => void;
  loadPreferences: (preferences: AppPreferences) => void;
  addHistory: (item: HistoryItem) => void;
}

export const useImageStore = create<ImageState>((set) => ({
  files: [],
  settings: defaultSettings,
  history: [],
  exportDirectory: null,
  isProcessing: false,
  startedAt: null,
  setFiles: (files) => set({ files }),
  addFiles: (files) =>
    set((state) => {
      const existingIds = new Set(state.files.map((file) => file.id));
      const nextFiles = files.filter((file) => !existingIds.has(file.id));
      return { files: [...state.files, ...nextFiles] };
    }),
  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    })),
  clearFiles: () => set({ files: [] }),
  updateSettings: (settings) => set({ settings }),
  updateProgress: (progress) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === progress.id
          ? {
              ...file,
              status: progress.status,
              progress: progress.progress,
              outputPath: progress.outputPath ?? file.outputPath,
              outputSize: progress.outputSize ?? file.outputSize,
              error: progress.error,
            }
          : file,
      ),
    })),
  setExportDirectory: (exportDirectory) => set({ exportDirectory }),
  setProcessing: (isProcessing) => set({ isProcessing, startedAt: isProcessing ? Date.now() : null }),
  loadPreferences: (preferences) => set({ settings: preferences.settings, history: preferences.history }),
  addHistory: (item) =>
    set((state) => ({
      history: [item, ...state.history].slice(0, 8),
    })),
}));
