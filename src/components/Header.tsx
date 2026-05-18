import { FolderOpen, Images, Moon, Sun } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  onSelectImages: () => void;
  onSelectFolder: () => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
}

export const Header = ({ onSelectImages, onSelectFolder, onToggleTheme, theme }: HeaderProps) => (
  <header className="drag-region flex h-[72px] items-center justify-between px-6 pt-2">
    <div className="pl-16">
      <h1 className="text-2xl font-semibold tracking-normal text-zinc-950 dark:text-[#F5F7FA] dark:[text-shadow:0_0_28px_rgba(77,163,255,0.14)]">Compress</h1>
      <p className="text-sm text-zinc-500 dark:text-[#9AA4B2]">Compressão local, rápida e privada.</p>
    </div>
    <div className="no-drag flex items-center gap-3">
      <Button
        aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        className="h-11 w-11 rounded-2xl px-0"
        onClick={onToggleTheme}
        title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        variant="ghost"
      >
        {theme === 'dark' ? <Sun size={21} strokeWidth={2.1} /> : <Moon size={21} strokeWidth={2.1} />}
      </Button>
      <Button onClick={onSelectFolder}>
        <FolderOpen size={17} />
        Pasta
      </Button>
      <Button onClick={onSelectImages} variant="primary">
        <Images size={17} />
        Selecionar imagens
      </Button>
    </div>
  </header>
);
