import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Dropzone } from '../components/Dropzone';
import { FileList } from '../components/FileList';
import { GlassPanel } from '../components/GlassPanel';
import { Header } from '../components/Header';
import { HistoryPanel } from '../components/HistoryPanel';
import { ProcessingPanel } from '../components/ProcessingPanel';
import { ResultsPanel } from '../components/ResultsPanel';
import { SettingsPanel } from '../components/SettingsPanel';
import { StatPill } from '../components/StatPill';
import { useImageActions } from '../hooks/useImageActions';
import { usePreferences } from '../hooks/usePreferences';
import { useImageStore } from '../store/useImageStore';
import { estimateOutputSize, formatBytes } from '../utils/format';

interface HomeProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Home = ({ onToggleTheme, theme }: HomeProps) => {
  usePreferences();
  const files = useImageStore((state) => state.files);
  const settings = useImageStore((state) => state.settings);
  const history = useImageStore((state) => state.history);
  const isProcessing = useImageStore((state) => state.isProcessing);
  const removeFile = useImageStore((state) => state.removeFile);
  const clearFiles = useImageStore((state) => state.clearFiles);
  const updateSettings = useImageStore((state) => state.updateSettings);
  const updateProgress = useImageStore((state) => state.updateProgress);
  const { exportImages, importPaths, selectFolder, selectImages } = useImageActions();

  const totalBytes = useMemo(() => files.reduce((total, file) => total + file.size, 0), [files]);
  const estimatedBytes = estimateOutputSize(totalBytes, settings.quality, settings.outputFormat, settings.smartCompression);

  useEffect(() => window.compress.onCompressionProgress(updateProgress), [updateProgress]);

  useEffect(() => {
    const disposers = [
      window.compress.onOpenImagesShortcut(selectImages),
      window.compress.onExportShortcut(exportImages),
      window.compress.onPreferencesShortcut(() => {
        document.querySelector('#settings-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }),
    ];

    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey) {
        return;
      }
      if (event.key.toLowerCase() === 'o') {
        event.preventDefault();
        void selectImages();
      }
      if (event.key.toLowerCase() === 's') {
        event.preventDefault();
        void exportImages();
      }
      if (event.key === ',') {
        event.preventDefault();
        document.querySelector('#settings-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      disposers.forEach((dispose) => dispose());
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [exportImages, selectImages]);

  return (
    <div className="min-h-screen overflow-hidden bg-canvas text-zinc-950 dark:bg-[#070B14] dark:text-[#F5F7FA]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(0,113,227,0.14),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(52,199,89,0.10),transparent_28%)] dark:bg-[radial-gradient(circle_at_18%_9%,rgba(10,132,255,0.18),transparent_34%),radial-gradient(circle_at_86%_4%,rgba(77,163,255,0.10),transparent_28%),radial-gradient(circle_at_54%_105%,rgba(14,21,37,0.92),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_18%)]" />
      <div className="pointer-events-none fixed inset-0 hidden opacity-[0.18] mix-blend-screen dark:block dark:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.05)_34%,transparent_46%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.045)_0_1px,transparent_1px)] dark:bg-[length:100%_100%,18px_18px]" />
      <Header onSelectFolder={selectFolder} onSelectImages={selectImages} onToggleTheme={onToggleTheme} theme={theme} />

      <main className="relative grid h-[calc(100vh-112px)] grid-cols-[minmax(300px,1fr)_300px_280px] gap-4 px-5 pb-5">
        <GlassPanel className="min-h-0 overflow-hidden p-4">
          <div className="grid h-full grid-rows-[auto_auto_1fr]">
            <Dropzone onImportPaths={importPaths} onSelectImages={selectImages} />
            <div className="mt-3 grid grid-cols-3 gap-2">
              <StatPill>{files.length} imagens</StatPill>
              <StatPill>{formatBytes(totalBytes)} originais</StatPill>
              <StatPill>{formatBytes(estimatedBytes)} estimados</StatPill>
            </div>
            <FileList files={files} onClear={clearFiles} onRemove={removeFile} />
          </div>
        </GlassPanel>

        <GlassPanel className="min-h-0 overflow-hidden p-4" id="settings-panel">
          <SettingsPanel onChange={updateSettings} settings={settings} totalBytes={totalBytes} />
        </GlassPanel>

        <motion.aside animate={{ opacity: 1, x: 0 }} className="grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-4" initial={{ opacity: 0, x: 16 }}>
          <GlassPanel className="p-4">
            <ProcessingPanel files={files} isProcessing={isProcessing} />
          </GlassPanel>
          <GlassPanel className="p-4">
            <ResultsPanel files={files} isProcessing={isProcessing} onExport={exportImages} />
          </GlassPanel>
          <GlassPanel className="min-h-0 overflow-hidden p-4">
            <HistoryPanel history={history} />
          </GlassPanel>
        </motion.aside>
      </main>
      <footer className="flex h-10 items-center justify-center px-5 text-xs text-zinc-500 dark:text-[#6B7280]">
        Desenvolvido por Nós Lab + Alison Cardoso
      </footer>
    </div>
  );
};
