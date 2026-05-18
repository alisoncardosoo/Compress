import { useEffect } from 'react';
import { useImageStore } from '../store/useImageStore';

export const usePreferences = () => {
  const settings = useImageStore((state) => state.settings);
  const history = useImageStore((state) => state.history);
  const loadPreferences = useImageStore((state) => state.loadPreferences);

  useEffect(() => {
    void window.compress.getPreferences().then(loadPreferences);
  }, [loadPreferences]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void window.compress.savePreferences({ settings, history });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [settings, history]);
};
