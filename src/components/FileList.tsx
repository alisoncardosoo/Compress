import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, Trash2, XCircle } from 'lucide-react';
import type { ImageFile } from '../types/image';
import { formatBytes } from '../utils/format';
import { Button } from './Button';

interface FileListProps {
  files: ImageFile[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const StatusIcon = ({ file }: { file: ImageFile }) => {
  if (file.status === 'processing') {
    return <Loader2 className="animate-spin text-apple" size={17} />;
  }
  if (file.status === 'done') {
    return <CheckCircle2 className="text-emerald-500" size={17} />;
  }
  if (file.status === 'error') {
    return <XCircle className="text-red-500" size={17} />;
  }
  return null;
};

export const FileList = ({ files, onRemove, onClear }: FileListProps) => (
  <div className="mt-4 min-h-0">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-[#F5F7FA]">Arquivos adicionados</h3>
      {files.length > 0 ? (
        <Button className="h-8 rounded-xl px-3 text-xs" onClick={onClear} variant="ghost">
          Limpar lista
        </Button>
      ) : null}
    </div>

    <div className="max-h-[calc(100vh-385px)] min-h-[180px] space-y-2 overflow-auto pr-1">
      <AnimatePresence initial={false}>
        {files.map((file) => (
          <motion.div
            key={file.id}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -12 }}
            initial={{ opacity: 0, y: 8 }}
            className="group grid grid-cols-[52px_1fr_auto] items-center gap-3 rounded-2xl border border-zinc-200/70 bg-white/64 p-2 transition duration-200 dark:border-white/[0.075] dark:bg-[rgba(255,255,255,0.045)] dark:shadow-[0_12px_34px_rgba(0,0,0,0.18)] dark:hover:border-white/[0.13] dark:hover:bg-[rgba(255,255,255,0.075)]"
          >
            <img alt="" className="h-11 w-12 rounded-xl object-cover" src={file.thumbnail} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-[#F5F7FA]">{file.name}</p>
                <StatusIcon file={file} />
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-[#9AA4B2]">
                {formatBytes(file.size)} · {file.format.toUpperCase()} · {file.width}x{file.height}
              </p>
              {file.status === 'processing' ? (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/[0.08]">
                  <div className="h-full rounded-full bg-apple transition-all dark:bg-gradient-to-r dark:from-[#0A84FF] dark:to-[#4DA3FF] dark:shadow-[0_0_16px_rgba(10,132,255,0.45)]" style={{ width: `${file.progress}%` }} />
                </div>
              ) : null}
              {file.error ? <p className="mt-1 text-xs text-red-500">{file.error}</p> : null}
            </div>
            <button
              aria-label={`Remover ${file.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-[#6B7280] dark:hover:bg-red-500/[0.12] dark:hover:text-red-300"
              onClick={() => onRemove(file.id)}
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {files.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200/70 bg-white/45 p-6 text-center text-sm text-zinc-500 dark:border-white/[0.07] dark:bg-white/[0.035] dark:text-[#9AA4B2]">
          Nenhuma imagem adicionada ainda.
        </div>
      ) : null}
    </div>
  </div>
);
