import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, UploadCloud } from 'lucide-react';
import { Button } from './Button';

interface DropzoneProps {
  onSelectImages: () => void;
  onImportPaths: (paths: string[]) => void;
}

export const Dropzone = ({ onSelectImages, onImportPaths }: DropzoneProps) => {
  const [isOver, setIsOver] = useState(false);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsOver(false);

      const paths = Array.from(event.dataTransfer.files)
        .map((file) => (file as File & { path?: string }).path)
        .filter((path): path is string => Boolean(path));

      if (paths.length > 0) {
        onImportPaths(paths);
      }
    },
    [onImportPaths],
  );

  return (
    <motion.div
      animate={{ scale: isOver ? 1.01 : 1 }}
      className={`relative flex min-h-[172px] flex-col items-center justify-center overflow-hidden rounded-[24px] border border-dashed p-5 text-center transition ${
        isOver
          ? 'border-apple bg-blue-50/80 dark:border-[#4DA3FF]/55 dark:bg-[#0A84FF]/[0.14] dark:shadow-[0_0_42px_rgba(10,132,255,0.20)]'
          : 'border-zinc-300/80 bg-white/55 dark:border-white/[0.09] dark:bg-white/[0.035] dark:hover:border-white/[0.14] dark:hover:bg-white/[0.055]'
      }`}
      onDragLeave={() => setIsOver(false)}
      onDragOver={(event) => {
        event.preventDefault();
        setIsOver(true);
      }}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,113,227,0.12),transparent_42%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(77,163,255,0.18),transparent_44%)]" />
      <div className="relative flex h-14 w-14 items-center justify-center rounded-[18px] bg-white shadow-soft dark:bg-[rgba(255,255,255,0.08)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.30),0_0_22px_rgba(10,132,255,0.12)] dark:ring-1 dark:ring-white/[0.10]">
        <ImagePlus className="text-apple" size={26} />
      </div>
      <h2 className="relative mt-3 text-xl font-semibold text-zinc-950 dark:text-[#F5F7FA]">Arraste imagens aqui</h2>
      <p className="relative mt-1 max-w-md text-sm leading-5 text-zinc-500 dark:text-[#9AA4B2]">
        JPG, PNG, WEBP, AVIF e HEIC quando suportado pelo Sharp local.
      </p>
      <Button className="relative mt-4" onClick={onSelectImages} variant="primary">
        <UploadCloud size={17} />
        Selecionar imagens
      </Button>
    </motion.div>
  );
};
