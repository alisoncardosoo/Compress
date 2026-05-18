export const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

export const calculateSavings = (originalBytes: number, outputBytes?: number): number => {
  if (!outputBytes || originalBytes <= 0) {
    return 0;
  }

  return Math.max(0, Math.round(((originalBytes - outputBytes) / originalBytes) * 100));
};

export const estimateOutputSize = (bytes: number, quality: number, format: string, smartCompression: boolean): number => {
  const formatFactor = format === 'avif' ? 0.46 : format === 'webp' ? 0.58 : format === 'jpg' ? 0.72 : 0.82;
  const qualityFactor = Math.max(0.18, Math.min(0.98, quality / 100));
  const smartFactor = smartCompression ? 0.9 : 1;

  return Math.round(bytes * formatFactor * (0.35 + qualityFactor * 0.65) * smartFactor);
};

export const getExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() ?? '' : '';
};
