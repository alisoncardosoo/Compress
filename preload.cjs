const { contextBridge, ipcRenderer } = require('electron');

const IPC_CHANNELS = {
  selectImages: 'dialog:select-images',
  selectFolder: 'dialog:select-folder',
  chooseExportDirectory: 'dialog:choose-export-directory',
  importPaths: 'images:import-paths',
  compressImages: 'images:compress',
  cancelCompression: 'images:cancel',
  compressionProgress: 'images:progress',
  openFolder: 'shell:open-folder',
  copyImage: 'clipboard:copy-image',
  getPreferences: 'preferences:get',
  savePreferences: 'preferences:save',
  uiOpenImages: 'ui:open-images',
  uiExport: 'ui:export',
  uiPreferences: 'ui:preferences',
};

contextBridge.exposeInMainWorld('imageshrink', {
  selectImages: () => ipcRenderer.invoke(IPC_CHANNELS.selectImages),
  selectFolder: () => ipcRenderer.invoke(IPC_CHANNELS.selectFolder),
  importPaths: (paths) => ipcRenderer.invoke(IPC_CHANNELS.importPaths, paths),
  chooseExportDirectory: () => ipcRenderer.invoke(IPC_CHANNELS.chooseExportDirectory),
  compressImages: (files, settings, exportDirectory) =>
    ipcRenderer.invoke(IPC_CHANNELS.compressImages, files, settings, exportDirectory),
  cancelCompression: () => ipcRenderer.invoke(IPC_CHANNELS.cancelCompression),
  openFolder: (path) => ipcRenderer.invoke(IPC_CHANNELS.openFolder, path),
  copyImage: (path) => ipcRenderer.invoke(IPC_CHANNELS.copyImage, path),
  getPreferences: () => ipcRenderer.invoke(IPC_CHANNELS.getPreferences),
  savePreferences: (preferences) => ipcRenderer.invoke(IPC_CHANNELS.savePreferences, preferences),
  onCompressionProgress: (callback) => {
    const listener = (_event, progress) => callback(progress);
    ipcRenderer.on(IPC_CHANNELS.compressionProgress, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.compressionProgress, listener);
  },
  onOpenImagesShortcut: (callback) => {
    const listener = () => callback();
    ipcRenderer.on(IPC_CHANNELS.uiOpenImages, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.uiOpenImages, listener);
  },
  onExportShortcut: (callback) => {
    const listener = () => callback();
    ipcRenderer.on(IPC_CHANNELS.uiExport, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.uiExport, listener);
  },
  onPreferencesShortcut: (callback) => {
    const listener = () => callback();
    ipcRenderer.on(IPC_CHANNELS.uiPreferences, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.uiPreferences, listener);
  },
});
