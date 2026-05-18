import { contextBridge, ipcRenderer } from 'electron';
import type { AppPreferences, CompressionProgress, CompressionSettings, ImageFile } from '../types/image.js';
import { IPC_CHANNELS } from './ipc.js';

contextBridge.exposeInMainWorld('compress', {
  selectImages: () => ipcRenderer.invoke(IPC_CHANNELS.selectImages),
  selectFolder: () => ipcRenderer.invoke(IPC_CHANNELS.selectFolder),
  importPaths: (paths: string[]) => ipcRenderer.invoke(IPC_CHANNELS.importPaths, paths),
  chooseExportDirectory: () => ipcRenderer.invoke(IPC_CHANNELS.chooseExportDirectory),
  compressImages: (files: ImageFile[], settings: CompressionSettings, exportDirectory?: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.compressImages, files, settings, exportDirectory),
  cancelCompression: () => ipcRenderer.invoke(IPC_CHANNELS.cancelCompression),
  openFolder: (path: string) => ipcRenderer.invoke(IPC_CHANNELS.openFolder, path),
  copyImage: (path: string) => ipcRenderer.invoke(IPC_CHANNELS.copyImage, path),
  getPreferences: () => ipcRenderer.invoke(IPC_CHANNELS.getPreferences),
  savePreferences: (preferences: AppPreferences) => ipcRenderer.invoke(IPC_CHANNELS.savePreferences, preferences),
  onCompressionProgress: (callback: (progress: CompressionProgress) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, progress: CompressionProgress) => callback(progress);
    ipcRenderer.on(IPC_CHANNELS.compressionProgress, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.compressionProgress, listener);
  },
  onOpenImagesShortcut: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on(IPC_CHANNELS.uiOpenImages, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.uiOpenImages, listener);
  },
  onExportShortcut: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on(IPC_CHANNELS.uiExport, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.uiExport, listener);
  },
  onPreferencesShortcut: (callback: () => void) => {
    const listener = () => callback();
    ipcRenderer.on(IPC_CHANNELS.uiPreferences, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.uiPreferences, listener);
  },
});
