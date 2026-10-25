'use client';

import dynamic from 'next/dynamic';
import type { LeafletMapProps } from './LeafletMap';

// Leaflet needs the browser (window), so the map only renders on the client.
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-neutral-200" />,
});

export default function AppMap(props: LeafletMapProps) {
  return <LeafletMap {...props} />;
}

export type { LeafletMapProps, MapMarker, MarkerKind } from './LeafletMap';
