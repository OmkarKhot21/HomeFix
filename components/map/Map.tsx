'use client';

import dynamic from 'next/dynamic';
import type { AppMapProps } from './MapLibreMap';

// The map needs the browser (WebGL), so it only renders on the client and loads on demand.
const MapLibreMap = dynamic(() => import('./MapLibreMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-neutral-200" />,
});

export default function AppMap({ className = 'h-72 w-full', ...props }: AppMapProps) {
  // The outer box holds the size so the grey placeholder matches while the map loads.
  return (
    <div className={`relative isolate ${className}`}>
      <MapLibreMap {...props} className="h-full w-full" />
    </div>
  );
}

export type { AppMapProps, MapMarker, MarkerKind } from './MapLibreMap';
