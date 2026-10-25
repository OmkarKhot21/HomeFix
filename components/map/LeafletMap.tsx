'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from 'react-leaflet';
import type { LatLng } from '@/lib/geo';

export type MarkerKind = 'home' | 'pro' | 'pin';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  kind: MarkerKind;
}

export interface LeafletMapProps {
  center: LatLng;
  zoom?: number;
  markers?: MapMarker[];
  /** Dashed route line between two points (straight line; no paid routing API). */
  line?: [LatLng, LatLng] | null;
  /** Pulsing "searching" rings at this point. */
  radar?: LatLng | null;
  /** Fit the view to all markers whenever they change. */
  fitToMarkers?: boolean;
  /** Address picking: tap the map or drag the pin. */
  onPick?: (p: LatLng) => void;
  interactive?: boolean;
  className?: string;
}

const HOUSE =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/></svg>';
const SCOOTER =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M8 17.5h7l2-7h-3"/><path d="M14 6h2.5l2 4.5"/></svg>';

function icon(kind: MarkerKind): L.DivIcon {
  if (kind === 'home') {
    return L.divIcon({
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      html: `<div style="width:40px;height:40px;border-radius:9999px;background:#0A0A0A;border:3px solid #fff;box-shadow:0 6px 16px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center">${HOUSE}</div>`,
    });
  }
  if (kind === 'pro') {
    return L.divIcon({
      className: '',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      html: `<div class="hf-pro-marker" style="width:44px;height:44px;border-radius:9999px;background:#FFC800;border:3px solid #fff;box-shadow:0 6px 18px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center">${SCOOTER}</div>`,
    });
  }
  // Address picking pin
  return L.divIcon({
    className: '',
    iconSize: [34, 46],
    iconAnchor: [17, 44],
    html: `<svg width="34" height="46" viewBox="0 0 34 46"><path d="M17 45s15-15.6 15-27A15 15 0 0 0 2 18c0 11.4 15 27 15 27z" fill="#0A0A0A" stroke="#fff" stroke-width="2.5"/><circle cx="17" cy="18" r="5.5" fill="#FFC800"/></svg>`,
  });
}

const radarIcon = L.divIcon({
  className: '',
  iconSize: [160, 160],
  iconAnchor: [80, 80],
  html: '<div class="hf-radar"><span></span><span></span><span></span></div>',
});

function FitBounds({ markers, line }: { markers: MapMarker[]; line?: [LatLng, LatLng] | null }) {
  const map = useMap();
  const key = markers.map((m) => `${m.lat.toFixed(4)},${m.lng.toFixed(4)}`).join('|');
  useEffect(() => {
    const pts = markers.map((m) => L.latLng(m.lat, m.lng));
    if (line) pts.push(L.latLng(line[0].lat, line[0].lng), L.latLng(line[1].lat, line[1].lng));
    if (pts.length === 1) map.setView(pts[0], Math.max(map.getZoom(), 15), { animate: true });
    else if (pts.length > 1) map.fitBounds(L.latLngBounds(pts), { padding: [60, 60], maxZoom: 16, animate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
}

function Recenter({ center }: { center: LatLng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
  }, [center.lat, center.lng, map]);
  return null;
}

function PickHandler({ onPick }: { onPick: (p: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LeafletMap({
  center,
  zoom = 15,
  markers = [],
  line = null,
  radar = null,
  fitToMarkers = false,
  onPick,
  interactive = true,
  className = 'h-72 w-full',
}: LeafletMapProps) {
  const icons = useMemo(() => ({ home: icon('home'), pro: icon('pro'), pin: icon('pin') }), []);

  return (
    <div className={`overflow-hidden ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        className="h-full w-full"
        zoomControl={interactive}
        dragging={interactive}
        scrollWheelZoom={false}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        attributionControl
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />
        {radar && <Marker position={[radar.lat, radar.lng]} icon={radarIcon} interactive={false} />}
        {line && (
          <Polyline
            positions={[
              [line[0].lat, line[0].lng],
              [line[1].lat, line[1].lng],
            ]}
            pathOptions={{ color: '#0A0A0A', weight: 4, dashArray: '2 10', lineCap: 'round', opacity: 0.85 }}
          />
        )}
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={icons[m.kind]}
            draggable={m.kind === 'pin' && Boolean(onPick)}
            eventHandlers={
              m.kind === 'pin' && onPick
                ? {
                    dragend(e) {
                      const ll = (e.target as L.Marker).getLatLng();
                      onPick({ lat: ll.lat, lng: ll.lng });
                    },
                  }
                : undefined
            }
          />
        ))}
        {onPick && <PickHandler onPick={onPick} />}
        {fitToMarkers ? <FitBounds markers={markers} line={line} /> : <Recenter center={center} />}
      </MapContainer>
    </div>
  );
}
