import { useCallback } from 'react';
import { useImageStore } from '../store/useImageStore';
import { calculateSavings } from '../utils/format';

export const useImageActions = () => {
  const files = useImageStore((state) => state.files);
  const settings = useImageStore((state) => state.settings);
  const exportDirectory = useImageStore((state) => state.exportDirectory);
  const addFiles = useImageStore((state) => state.addFiles);
  const setExportDirectory = useImageStore((state) => state.setExportDirectory);
  const setProcessing = useImageStore((state) => state.setProcessing);
  const addHistory = useImageStore((state) => state.addHistory);

  const selectImages = useCallback(async () => {
    const selected = await window.compress.selectImages();
    addFiles(selected);
  }, [addFiles]);

  const selectFolder = useCallback(async () => {
    const selected = await window.compress.selectFolder();
    addFiles(selected);
  }, [addFiles]);

  const importPaths = useCallback(
    async (paths: string[]) => {
      const selected = await window.compress.importPaths(paths);
      addFiles(selected);
    },
    [addFiles],
  );

  const chooseExportDirectory = useCallback(async () => {
    const directory = await window.compress.chooseExportDirectory();
    setExportDirectory(directory);
    return directory;
  }, [setExportDirectory]);

  const exportImages = useCallback(async () => {
    if (files.length === 0) {
      return;
    }

    const directory = exportDirectory ?? (await chooseExportDirectory());
    if (!settings.overwriteOriginal && !directory) {
      return;
    }

    setProcessing(true);
    const results = await window.compress.compressImages(files, settings, directory ?? undefined);
    setProcessing(false);

    const successful = results.filter((result) => result.status === 'done');
    if (successful.length > 0) {
      const outputBytes = successful.reduce((total, result) => total + result.outputSize, 0);
      const originalBytes = files
        .filter((file) => successful.some((result) => result.id === file.id))
        .reduce((total, file) => total + file.size, 0);
      const firstOutput = successful[0]?.outputPath ?? directory ?? '';

      addHistory({
        id: `${Date.now()}`,
        completedAt: new Date().toISOString(),
        fileCount: successful.length,
        originalBytes,
        outputBytes,
        outputDirectory: firstOutput,
        settings,
      });

      calculateSavings(originalBytes, outputBytes);
    }
  }, [addHistory, chooseExportDirectory, exportDirectory, files, setProcessing, settings]);

  return { selectImages, selectFolder, importPaths, chooseExportDirectory, exportImages };
};
