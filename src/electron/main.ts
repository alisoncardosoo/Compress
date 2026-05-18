import path from 'node:path';
import { constants } from 'node:fs';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { app, BrowserWindow, clipboard, dialog, ipcMain, Menu, nativeImage, nativeTheme, shell } from 'electron';
import Store from 'electron-store';
import type { AppPreferences, CompressionSettings, ImageFile } from '../types/image.js';
import { defaultSettings } from '../utils/presets.js';
import {
  cancelCompression,
  collectImagesFromDirectory,
  compressImages,
  createImageFile,
} from '../services/compressionService.js';
import { IPC_CHANNELS } from './ipc.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = !app.isPackaged;

const store = new Store<AppPreferences>({
  defaults: {
    settings: defaultSettings,
    history: [],
  },
});

const getWindow = (): BrowserWindow | null => BrowserWindow.getAllWindows()[0] ?? null;

const imageFilters = [
  { name: 'Imagens', extensions: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'heic', 'heif'] },
];

const resolveIconPath = (isDarkMode: boolean): string => {
  if (isDev) {
    return path.join(process.cwd(), 'build', isDarkMode ? 'icon-dark.icns' : 'icon.icns');
  }

  return path.join(process.resourcesPath, isDarkMode ? 'icon-dark.icns' : 'icon.icns');
};

const applyDockIcon = async () => {
  if (process.platform !== 'darwin' || !app.dock) {
    return;
  }

  const iconPath = resolveIconPath(nativeTheme.shouldUseDarkColors);

  try {
    await access(iconPath, constants.R_OK);
    app.dock.setIcon(iconPath);
  } catch {
    // Silent fallback: mantém o ícone padrão caso o arquivo não exista.
  }
};

const showOpenDialog = async (options: Electron.OpenDialogOptions): Promise<Electron.OpenDialogReturnValue> => {
  const window = getWindow();

  if (!window || window.isDestroyed()) {
    return dialog.showOpenDialog(options);
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.show();
  window.focus();

  return dialog.showOpenDialog(window, options);
};

const createWindow = async () => {
  const window = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 980,
    minHeight: 680,
    show: false,
    title: 'Compress',
    titleBarStyle: 'hidden',
    vibrancy: 'under-window',
    visualEffectState: 'active',
    backgroundColor: '#f5f5f7',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  let didShowWindow = false;
  const showWindow = () => {
    if (!didShowWindow && !window.isDestroyed()) {
      window.center();
      didShowWindow = true;
      window.show();
    }
  };

  window.once('ready-to-show', showWindow);
  setTimeout(showWindow, 2000);

  window.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error('[Compress] Renderer load failed', { errorCode, errorDescription, validatedURL });
  });

  try {
    if (isDev) {
      await window.loadURL('http://127.0.0.1:5173');
    } else {
      const rendererEntry = path.join(app.getAppPath(), 'dist', 'index.html');
      await window.loadFile(rendererEntry);
    }
  } catch (error) {
    console.error('[Compress] Failed to create main window', error);
    showWindow();
    await dialog.showMessageBox(window, {
      type: 'error',
      title: 'Erro ao abrir o app',
      message: 'Nao foi possivel carregar a interface do Compress.',
      detail: error instanceof Error ? error.message : String(error),
    });
  }
};

const createMenu = () => {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Compress',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
          label: 'Preferências',
          accelerator: 'CommandOrControl+,',
          click: () => getWindow()?.webContents.send(IPC_CHANNELS.uiPreferences),
        },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Abrir imagens',
          accelerator: 'CommandOrControl+O',
          click: () => getWindow()?.webContents.send(IPC_CHANNELS.uiOpenImages),
        },
        {
          label: 'Exportar',
          accelerator: 'CommandOrControl+S',
          click: () => getWindow()?.webContents.send(IPC_CHANNELS.uiExport),
        },
      ],
    },
    {
      label: 'Editar',
      submenu: [{ role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }],
    },
    {
      label: 'Visualizar',
      submenu: [{ role: 'reload' }, { role: 'toggleDevTools' }, { role: 'togglefullscreen' }],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

const mapPathsToImages = async (paths: string[]): Promise<ImageFile[]> => {
  const files = await Promise.all(paths.map((filePath) => createImageFile(filePath)));
  return files.filter((file): file is ImageFile => Boolean(file));
};

ipcMain.handle(IPC_CHANNELS.selectImages, async () => {
  const result = await showOpenDialog({
    title: 'Selecionar imagens',
    properties: ['openFile', 'multiSelections'],
    filters: imageFilters,
  });

  return result.canceled ? [] : mapPathsToImages(result.filePaths);
});

ipcMain.handle(IPC_CHANNELS.selectFolder, async () => {
  const result = await showOpenDialog({
    title: 'Selecionar pasta',
    properties: ['openDirectory'],
  });

  return result.canceled || !result.filePaths[0] ? [] : collectImagesFromDirectory(result.filePaths[0]);
});

ipcMain.handle(IPC_CHANNELS.chooseExportDirectory, async () => {
  const result = await showOpenDialog({
    title: 'Escolher pasta de exportação',
    properties: ['openDirectory', 'createDirectory'],
  });

  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle(IPC_CHANNELS.importPaths, async (_event, paths: string[]) => {
  const normalizedPaths = paths.map((filePath) => path.normalize(filePath));
  const imported = await Promise.all(
    normalizedPaths.map(async (filePath) => {
      const stat = await import('node:fs/promises').then((fs) => fs.stat(filePath));
      return stat.isDirectory() ? collectImagesFromDirectory(filePath) : mapPathsToImages([filePath]);
    }),
  );

  return imported.flat();
});

ipcMain.handle(IPC_CHANNELS.compressImages, async (_event, files: ImageFile[], settings: CompressionSettings, exportDirectory?: string) => {
  const window = getWindow();
  if (!window) {
    throw new Error('Janela principal indisponível.');
  }

  return compressImages(window, files, settings, exportDirectory);
});

ipcMain.handle(IPC_CHANNELS.cancelCompression, () => cancelCompression());

ipcMain.handle(IPC_CHANNELS.openFolder, async (_event, targetPath: string) => {
  const normalized = path.normalize(targetPath);
  shell.showItemInFolder(normalized);
});

ipcMain.handle(IPC_CHANNELS.copyImage, async (_event, targetPath: string) => {
  const image = nativeImage.createFromPath(path.normalize(targetPath));
  if (!image.isEmpty()) {
    clipboard.writeImage(image);
  }
});

ipcMain.handle(IPC_CHANNELS.getPreferences, () => store.store);

ipcMain.handle(IPC_CHANNELS.savePreferences, (_event, preferences: AppPreferences) => {
  store.set(preferences);
});

app.whenReady().then(async () => {
  await applyDockIcon();
  nativeTheme.on('updated', () => {
    void applyDockIcon();
  });

  createMenu();
  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
