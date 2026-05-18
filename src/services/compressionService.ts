import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import type { BrowserWindow } from 'electron';
import type { CompressionProgress, CompressionResult, CompressionSettings, ImageFile, OutputFormat } from '../types/image.js';
import { IPC_CHANNELS } from '../electron/ipc.js';

const supportedExtensions = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'heic', 'heif']);
let cancelled = false;

const safePath = (filePath: string): string => path.normalize(filePath);

const createId = (filePath: string): string => crypto.createHash('sha1').update(filePath).digest('hex');

const outputExtension = (format: OutputFormat): string => (format === 'jpg' ? 'jpg' : format);

const emitProgress = (window: BrowserWindow, progress: CompressionProgress) => {
  window.webContents.send(IPC_CHANNELS.compressionProgress, progress);
};

export const isSupportedImage = (filePath: string): boolean => {
  const extension = path.extname(filePath).slice(1).toLowerCase();
  return supportedExtensions.has(extension);
};

export const createImageFile = async (filePath: string): Promise<ImageFile | null> => {
  const normalized = safePath(filePath);
  if (!isSupportedImage(normalized)) {
    return null;
  }

  const stat = await fs.stat(normalized);
  if (!stat.isFile()) {
    return null;
  }

  const metadata = await sharp(normalized, { failOn: 'none' }).metadata();
  const thumbnailBuffer = await sharp(normalized, { failOn: 'none' })
    .rotate()
    .resize({ width: 160, height: 120, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 64 })
    .toBuffer();

  const name = path.basename(normalized);
  const extension = path.extname(normalized).slice(1).toLowerCase();

  return {
    id: createId(normalized),
    path: normalized,
    name,
    extension,
    format: metadata.format ?? extension,
    size: stat.size,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    thumbnail: `data:image/webp;base64,${thumbnailBuffer.toString('base64')}`,
    status: 'idle',
    progress: 0,
  };
};

export const collectImagesFromDirectory = async (directory: string): Promise<ImageFile[]> => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const imagePaths = entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(directory, entry.name))
    .filter(isSupportedImage);

  const files = await Promise.all(imagePaths.map((filePath) => createImageFile(filePath)));
  return files.filter((file): file is ImageFile => Boolean(file));
};

const configureOutput = (pipeline: sharp.Sharp, settings: CompressionSettings): sharp.Sharp => {
  const quality = Math.max(1, Math.min(100, settings.quality));

  if (settings.outputFormat === 'jpg') {
    return pipeline.jpeg({ quality, mozjpeg: true, progressive: true });
  }

  if (settings.outputFormat === 'png') {
    return pipeline.png({ quality, compressionLevel: 9, adaptiveFiltering: true, palette: settings.smartCompression });
  }

  if (settings.outputFormat === 'webp') {
    return pipeline.webp({ quality, effort: settings.smartCompression ? 5 : 3 });
  }

  return pipeline.avif({ quality, effort: settings.smartCompression ? 6 : 4 });
};

const createOutputPath = (file: ImageFile, settings: CompressionSettings, exportDirectory?: string): string => {
  const parsed = path.parse(file.path);
  const extension = outputExtension(settings.outputFormat);
  const sourceExtension = parsed.ext.slice(1).toLowerCase();

  if (settings.overwriteOriginal && (sourceExtension === extension || (sourceExtension === 'jpeg' && extension === 'jpg'))) {
    return file.path;
  }

  if (settings.overwriteOriginal) {
    return path.join(parsed.dir, `${parsed.name}.${extension}`);
  }

  const directory = exportDirectory ?? path.join(parsed.dir, 'Compress');
  return path.join(directory, `${parsed.name}-compressed.${extension}`);
};

const compressOne = async (
  window: BrowserWindow,
  file: ImageFile,
  settings: CompressionSettings,
  exportDirectory?: string,
): Promise<CompressionResult> => {
  if (cancelled) {
    return { id: file.id, outputPath: '', outputSize: 0, status: 'cancelled' };
  }

  emitProgress(window, { id: file.id, status: 'processing', progress: 12 });

  try {
    const outputPath = createOutputPath(file, settings, exportDirectory);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    const isSamePath = path.resolve(outputPath) === path.resolve(file.path);
    const writePath = isSamePath ? `${outputPath}.compress-tmp` : outputPath;

    let pipeline = sharp(file.path, { failOn: 'none' }).rotate();
    if (settings.keepExif) {
      pipeline = pipeline.keepMetadata();
    }

    if (settings.resize.mode === 'auto') {
      pipeline = pipeline.resize({
        width: settings.resize.maxWidth,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    emitProgress(window, { id: file.id, status: 'processing', progress: 48 });
    await configureOutput(pipeline, settings).toFile(writePath);
    if (isSamePath) {
      await fs.rename(writePath, outputPath);
    }
    const outputStat = await fs.stat(outputPath);

    emitProgress(window, { id: file.id, status: 'done', progress: 100, outputPath, outputSize: outputStat.size });
    return { id: file.id, outputPath, outputSize: outputStat.size, status: 'done' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao comprimir imagem.';
    emitProgress(window, { id: file.id, status: 'error', progress: 0, error: message });
    return { id: file.id, outputPath: '', outputSize: 0, status: 'error', error: message };
  }
};

export const compressImages = async (
  window: BrowserWindow,
  files: ImageFile[],
  settings: CompressionSettings,
  exportDirectory?: string,
): Promise<CompressionResult[]> => {
  cancelled = false;
  const concurrency = Math.max(2, Math.min(os.cpus().length - 1, 4));
  const queue = [...files];
  const results: CompressionResult[] = [];

  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length > 0 && !cancelled) {
      const next = queue.shift();
      if (next) {
        const result = await compressOne(window, next, settings, exportDirectory);
        results.push(result);
      }
    }
  });

  await Promise.all(workers);

  if (cancelled) {
    files
      .filter((file) => !results.some((result) => result.id === file.id))
      .forEach((file) => emitProgress(window, { id: file.id, status: 'cancelled', progress: 0 }));
  }

  return results;
};

export const cancelCompression = () => {
  cancelled = true;
};
