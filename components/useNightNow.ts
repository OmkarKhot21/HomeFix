'use client';

import { useSyncExternalStore } from 'react';
import { isNightNowInIndia } from '@/lib/pricing';

// True from 8 PM to 6 AM India time, following the real clock.
// Re-checks every 30 seconds so an open page switches at 8:00 PM without a refresh.
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  const onVisible = () => document.visibilityState === 'visible' && onChange();
  document.addEventListener('visibilitychange', onVisible);
  return () => {
    clearInterval(id);
    document.removeEventListener('visibilitychange', onVisible);
  };
}

export function useNightNow(): boolean {
  return useSyncExternalStore(subscribe, () => isNightNowInIndia(), () => isNightNowInIndia());
}
