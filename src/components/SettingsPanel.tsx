import { Check, Sparkles } from 'lucide-react';
import type { CompressionPreset, CompressionSettings, OutputFormat } from '../types/image';
import { estimateOutputSize, formatBytes } from '../utils/format';
import { applyPreset } from '../utils/presets';
import { Button } from './Button';

interface SettingsPanelProps {
  settings: CompressionSettings;
  totalBytes: number;
  onChange: (settings: CompressionSettings) => void;
}

const presets: Array<{ id: CompressionPreset; label: string }> = [
  { id: 'smart', label: 'Inteligente' },
  { id: 'web', label: 'Web' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'ultra', label: 'Ultra' },
  { id: 'quality', label: 'Máxima' },
];

const formats: OutputFormat[] = ['jpg', 'png', 'webp', 'avif'];

export const SettingsPanel = ({ settings, totalBytes, onChange }: SettingsPanelProps) => {
  const estimated = estimateOutputSize(totalBytes, settings.quality, settings.outputFormat, settings.smartCompression);
  const reduction = totalBytes > 0 ? Math.max(0, Math.round(((totalBytes - estimated) / totalBytes) * 100)) : 0;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-[#F5F7FA]">Compressão</h3>
          <span className="text-sm font-semibold text-apple">{settings.quality}%</span>
        </div>
        <input
          aria-label="Qualidade"
          className="accent-apple w-full"
          max={100}
          min={1}
          onChange={(event) => onChange({ ...settings, quality: Number(event.target.value), preset: 'smart' })}
          type="range"
          value={settings.quality}
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-zinc-400 dark:text-[#6B7280]">Presets</p>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              className={`rounded-xl px-2 py-2 text-center text-[11px] font-semibold transition ${
                settings.preset === preset.id
                  ? 'bg-apple text-white dark:bg-[#0A84FF] dark:shadow-[0_10px_24px_rgba(10,132,255,0.26),0_1px_0_rgba(255,255,255,0.20)_inset]'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-white/[0.055] dark:text-[#B4BEC9] dark:ring-1 dark:ring-white/[0.06] dark:hover:bg-white/[0.11] dark:hover:text-[#F5F7FA]'
              }`}
              key={preset.id}
              onClick={() => onChange(applyPreset(preset.id, settings))}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-zinc-400 dark:text-[#6B7280]">Converter para</p>
        <div className="grid grid-cols-4 rounded-xl bg-zinc-100 p-1 dark:bg-white/[0.055] dark:ring-1 dark:ring-white/[0.07]">
          {formats.map((format) => (
            <button
              className={`rounded-lg py-1.5 text-xs font-bold uppercase transition ${
                settings.outputFormat === format
                  ? 'bg-white text-apple shadow-sm dark:bg-[#0A84FF]/[0.18] dark:text-[#8EC5FF] dark:shadow-[0_8px_20px_rgba(10,132,255,0.16),0_1px_0_rgba(255,255,255,0.10)_inset]'
                  : 'text-zinc-500 dark:text-[#9AA4B2] dark:hover:text-[#F5F7FA]'
              }`}
              key={format}
              onClick={() => onChange({ ...settings, outputFormat: format })}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-zinc-100/70 p-3 transition duration-200 dark:border dark:border-white/[0.07] dark:bg-white/[0.045] dark:hover:bg-white/[0.075]">
        <span>
          <span className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-[#F5F7FA]">
            <Sparkles size={16} className="text-apple" />
            Compressão inteligente
          </span>
        </span>
        <input
          checked={settings.smartCompression}
          className="h-5 w-5 accent-apple"
          onChange={(event) => onChange({ ...settings, smartCompression: event.target.checked })}
          type="checkbox"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <Toggle
          checked={settings.resize.mode === 'keep'}
          label="Manter dimensões"
          onClick={() => onChange({ ...settings, resize: { ...settings.resize, mode: 'keep' } })}
        />
        <Toggle
          checked={settings.resize.mode === 'auto'}
          label="Redimensionar auto"
          onClick={() => onChange({ ...settings, resize: { ...settings.resize, mode: 'auto' } })}
        />
      </div>

      {settings.resize.mode === 'auto' ? (
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-zinc-500 dark:text-[#9AA4B2]">
            <span>Largura máxima</span>
            <span>{settings.resize.maxWidth}px</span>
          </div>
          <input
            className="accent-apple w-full"
            max={3840}
            min={640}
            onChange={(event) => onChange({ ...settings, resize: { ...settings.resize, maxWidth: Number(event.target.value) } })}
            step={80}
            type="range"
            value={settings.resize.maxWidth}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <Toggle checked={settings.keepExif} label="Manter EXIF" onClick={() => onChange({ ...settings, keepExif: !settings.keepExif })} />
        <Toggle
          checked={settings.overwriteOriginal}
          label="Sobrescrever"
          onClick={() => onChange({ ...settings, overwriteOriginal: !settings.overwriteOriginal })}
        />
      </div>

      <div className="premium-accent-card mt-auto rounded-2xl bg-blue-50 p-3">
        <p className="text-xs font-semibold uppercase text-blue-500 dark:text-[#8EC5FF]">Estimativa em tempo real</p>
        <div className="mt-1 flex items-end justify-between">
          <div>
            <p className="text-2xl font-semibold text-zinc-950 dark:text-[#F5F7FA]">{reduction}%</p>
            <p className="text-xs text-zinc-500 dark:text-[#9AA4B2]">redução estimada</p>
          </div>
          <p className="text-sm font-semibold text-zinc-700 dark:text-[#D7DEE8]">{formatBytes(estimated)}</p>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ checked, label, onClick }: { checked: boolean; label: string; onClick: () => void }) => (
  <Button className={`h-auto justify-start rounded-xl px-2.5 py-2 text-xs ${checked ? 'ring-2 ring-apple/40 dark:ring-[#4DA3FF]/45' : ''}`} onClick={onClick}>
    <span className={`flex h-5 w-5 items-center justify-center rounded-full ${checked ? 'bg-apple text-white dark:bg-[#0A84FF] dark:shadow-[0_0_16px_rgba(10,132,255,0.38)]' : 'bg-zinc-200 dark:bg-white/[0.10]'}`}>
      {checked ? <Check size={13} /> : null}
    </span>
    {label}
  </Button>
);
