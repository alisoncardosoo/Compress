import type { HistoryItem } from '../types/image';
import { calculateSavings, formatBytes } from '../utils/format';

interface HistoryPanelProps {
  history: HistoryItem[];
}

export const HistoryPanel = ({ history }: HistoryPanelProps) => (
  <div className="flex h-full min-h-0 flex-col">
    <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-[#F5F7FA]">Histórico recente</h3>
    <div className="min-h-0 space-y-2 overflow-auto pr-1">
      {history.slice(0, 4).map((item) => (
        <div className="rounded-xl bg-zinc-100/70 px-3 py-2 transition duration-200 dark:border dark:border-white/[0.07] dark:bg-white/[0.045] dark:shadow-[0_10px_28px_rgba(0,0,0,0.18)] dark:hover:bg-white/[0.07]" key={item.id}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-zinc-800 dark:text-[#F5F7FA]">{item.fileCount} imagens</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-300">{calculateSavings(item.originalBytes, item.outputBytes)}%</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-[#9AA4B2]">
            {formatBytes(item.originalBytes)} → {formatBytes(item.outputBytes)}
          </p>
        </div>
      ))}
      {history.length === 0 ? <p className="text-sm text-zinc-500 dark:text-[#9AA4B2]">As últimas compressões aparecerão aqui.</p> : null}
    </div>
  </div>
);
