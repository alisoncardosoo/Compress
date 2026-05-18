import { Copy, ExternalLink, FolderOpen, Save } from 'lucide-react';
import type { ImageFile } from '../types/image';
import { calculateSavings, formatBytes } from '../utils/format';
import { Button } from './Button';

interface ResultsPanelProps {
  files: ImageFile[];
  onExport: () => void;
  isProcessing: boolean;
}

export const ResultsPanel = ({ files, isProcessing, onExport }: ResultsPanelProps) => {
  const completed = files.filter((file) => file.status === 'done' && file.outputSize && file.outputPath);
  const originalBytes = completed.reduce((total, file) => total + file.size, 0);
  const outputBytes = completed.reduce((total, file) => total + (file.outputSize ?? 0), 0);
  const savings = calculateSavings(originalBytes, outputBytes);
  const firstOutput = completed[0]?.outputPath;

  return (
    <div className="space-y-3">
      <div className="premium-accent-card rounded-2xl border border-blue-100/80 bg-blue-50/80 p-4 text-zinc-950 shadow-soft dark:text-[#F5F7FA]">
        <p className="text-xs font-semibold uppercase text-blue-500 dark:text-[#8EC5FF]">Economia total</p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <div>
            <p className="text-3xl font-semibold">{savings}%</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-[#B4BEC9]">
              {formatBytes(originalBytes)} → {formatBytes(outputBytes)}
            </p>
          </div>
          <Button className="px-3" disabled={files.length === 0 || isProcessing} onClick={onExport} variant="primary">
            <Save size={17} />
            Exportar
          </Button>
        </div>
      </div>

      {completed[0] ? (
        <div className="grid grid-cols-2 gap-2">
          <Preview title="Antes" bytes={completed[0].size} src={completed[0].thumbnail} />
          <Preview title="Depois" bytes={completed[0].outputSize ?? 0} src={completed[0].thumbnail} />
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-2">
        <Button className="px-2 text-xs" disabled={!firstOutput} onClick={() => firstOutput && window.compress.openFolder(firstOutput)}>
          <FolderOpen size={16} />
          Pasta
        </Button>
        <Button className="px-2 text-xs" disabled={!firstOutput} onClick={() => firstOutput && window.compress.copyImage(firstOutput)}>
          <Copy size={16} />
          Copiar
        </Button>
        <Button className="px-2 text-xs" disabled={!firstOutput} onClick={() => firstOutput && window.compress.openFolder(firstOutput)} variant="ghost">
          <ExternalLink size={16} />
          Ver
        </Button>
      </div>
    </div>
  );
};

const Preview = ({ bytes, src, title }: { bytes: number; src: string; title: string }) => (
  <div className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.045] dark:shadow-[0_12px_32px_rgba(0,0,0,0.20)]">
    <img alt="" className="h-20 w-full object-cover" src={src} />
    <div className="p-2.5">
      <p className="text-xs font-semibold text-zinc-500 dark:text-[#9AA4B2]">{title}</p>
      <p className="text-sm font-semibold text-zinc-900 dark:text-[#F5F7FA]">{formatBytes(bytes)}</p>
    </div>
  </div>
);
