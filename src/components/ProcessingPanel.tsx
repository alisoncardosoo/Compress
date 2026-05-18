import { motion } from 'framer-motion';
import { Gauge, PauseCircle } from 'lucide-react';
import type { ImageFile } from '../types/image';
import { Button } from './Button';

interface ProcessingPanelProps {
  files: ImageFile[];
  isProcessing: boolean;
}

export const ProcessingPanel = ({ files, isProcessing }: ProcessingPanelProps) => {
  const done = files.filter((file) => file.status === 'done').length;
  const active = files.filter((file) => file.status === 'processing').length;
  const progress = files.length > 0 ? Math.round((done / files.length) * 100) : 0;

  return (
    <div className="premium-dark-card rounded-2xl bg-zinc-100/70 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-[#0A84FF]/[0.13] dark:shadow-[0_0_22px_rgba(10,132,255,0.18)] dark:ring-1 dark:ring-[#4DA3FF]/20">
            <Gauge size={18} className="text-apple" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-950 dark:text-[#F5F7FA]">Processamento</p>
            <p className="text-xs text-zinc-500 dark:text-[#9AA4B2]">
              {isProcessing ? `${active} em paralelo · velocidade otimizada` : 'Pronto para exportar'}
            </p>
          </div>
        </div>
        {isProcessing ? (
          <Button className="h-9 px-3" onClick={() => void window.compress.cancelCompression()} variant="ghost">
            <PauseCircle size={16} />
            Cancelar
          </Button>
        ) : null}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white dark:bg-white/[0.08] dark:shadow-[inset_0_1px_1px_rgba(0,0,0,0.35)]">
        <motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-apple dark:bg-gradient-to-r dark:from-[#0A84FF] dark:to-[#4DA3FF] dark:shadow-[0_0_18px_rgba(10,132,255,0.48)]" />
      </div>
      <div className="mt-2 flex justify-between text-xs text-zinc-500 dark:text-[#9AA4B2]">
        <span>{done} finalizados</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
};
