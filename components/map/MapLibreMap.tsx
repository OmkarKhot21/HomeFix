'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { GeoJSONSource } from 'maplibre-gl';
import type { LatLng } from '@/lib/geo';

// Smooth, GPU-drawn map (MapLibre GL) with free OpenFreeMap tiles: no API key, no usage limit.

export type MarkerKind = 'home' | 'pro' | 'pin';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  kind: MarkerKind;
}

export interface AppMapProps {
  center: LatLng;
  zoom?: number;
  markers?: MapMarker[];
  /** Road route to draw (from OSRM). */
  route?: LatLng[] | null;
  /** Fallback dashed straight line when no road route is available. */
  line?: [LatLng, LatLng] | null;
  /** Pulsing "searching" rings at this point. */
  radar?: LatLng | null;
  /** GPS accuracy circle (metres) around the pin. */
  accuracyM?: number | null;
  /** Keep all markers (and the route) in view as they move. */
  fitToMarkers?: boolean;
  /** Address picking: tap the map or drag the pin. */
  onPick?: (p: LatLng) => void;
  interactive?: boolean;
  className?: string;
}

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';
const GLIDE_MS = 3500; // pro pin glides between GPS updates instead of jumping

const HOUSE =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/></svg>';
const SCOOTER =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M8 17.5h7l2-7h-3"/><path d="M14 6h2.5l2 4.5"/></svg>';

function markerEl(kind: MarkerKind): HTMLElement {
  const el = document.createElement('div');
  el.style.zIndex = kind === 'pro' ? '3' : '2'; // above the radar rings
  if (kind === 'home') {
    el.innerHTML = `<div style="width:40px;height:40px;border-radius:9999px;background:#0A0A0A;border:3px solid #fff;box-shadow:0 6px 16px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center">${HOUSE}</div>`;
  } else if (kind === 'pro') {
    el.innerHTML = `<div class="hf-pro-marker" style="width:44px;height:44px;border-radius:9999px;background:#FFC800;border:3px solid #fff;box-shadow:0 6px 18px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center">${SCOOTER}</div>`;
  } else {
    el.innerHTML = `<svg width="34" height="46" viewBox="0 0 34 46" style="display:block;cursor:grab"><path d="M17 45s15-15.6 15-27A15 15 0 0 0 2 18c0 11.4 15 27 15 27z" fill="#0A0A0A" stroke="#fff" stroke-width="2.5"/><circle cx="17" cy="18" r="5.5" fill="#FFC800"/></svg>`;
  }
  return el;
}

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Circle polygon (64 points) for the GPS accuracy ring. */
function circle(c: LatLng, metres: number): GeoJSON.Feature<GeoJSON.Polygon> {
  const pts: [number, number][] = [];
  const dLat = metres / 111_320;
  const dLng = metres / (111_320 * Math.cos((c.lat * Math.PI) / 180));
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * 2 * Math.PI;
    pts.push([c.lng + dLng * Math.cos(a), c.lat + dLat * Math.sin(a)]);
  }
  return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [pts] } };
}

const lineFeature = (pts: LatLng[]): GeoJSON.Feature<GeoJSON.LineString> => ({
  type: 'Feature',
  properties: {},
  geometry: { type: 'LineString', coordinates: pts.map((p) => [p.lng, p.lat]) },
});
const EMPTY: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

export default function MapLibreMap({
  center,
  zoom = 15,
  markers = [],
  route = null,
  line = null,
  radar = null,
  accuracyM = null,
  fitToMarkers = false,
  onPick,
  interactive = true,
  className = 'h-72 w-full',
}: AppMapProps) {
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const ready = useRef(false);
  const markerRefs = useRef(new Map<string, { m: maplibregl.Marker; kind: MarkerKind; anim?: number }>());
  const radarRef = useRef<maplibregl.Marker | null>(null);
  const onPickRef = useRef(onPick);
  const latest = useRef({ markers, route, line, accuracyM, center });
  onPickRef.current = onPick;
  latest.current = { markers, route, line, accuracyM, center };

  // ---- Create the map once ----
  useEffect(() => {
    if (!box.current) return;
    const map = new maplibregl.Map({
      container: box.current,
      style: STYLE_URL,
      center: [center.lng, center.lat],
      zoom,
      interactive,
      attributionControl: { compact: true },
      dragRotate: false,
      pitchWithRotate: false,
      scrollZoom: false, // don't hijack page scrolling; pinch / buttons / double-tap still zoom
      fadeDuration: 150,
    });
    map.touchZoomRotate.disableRotation();
    if (interactive) map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.on('click', (e) => onPickRef.current?.({ lat: e.lngLat.lat, lng: e.lngLat.lng }));

    map.on('load', () => {
      map.addSource('route', { type: 'geojson', data: EMPTY });
      map.addSource('line', { type: 'geojson', data: EMPTY });
      map.addSource('accuracy', { type: 'geojson', data: EMPTY });
      map.addLayer({ id: 'accuracy-fill', type: 'fill', source: 'accuracy', paint: { 'fill-color': '#FFC800', 'fill-opacity': 0.18 } });
      map.addLayer({ id: 'accuracy-edge', type: 'line', source: 'accuracy', paint: { 'line-color': '#C79C00', 'line-width': 1.5, 'line-opacity': 0.7 } });
      // Road route: white casing under a black line reads clearly on the light map.
      map.addLayer({
        id: 'route-casing', type: 'line', source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#ffffff', 'line-width': 9 },
      });
      map.addLayer({
        id: 'route-line', type: 'line', source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#0A0A0A', 'line-width': 5 },
      });
      map.addLayer({
        id: 'straight-line', type: 'line', source: 'line',
        layout: { 'line-cap': 'round' },
        paint: { 'line-color': '#0A0A0A', 'line-width': 3, 'line-dasharray': [0.5, 2.5], 'line-opacity': 0.8 },
      });
      ready.current = true;
      syncShapes(map);
      fit(map, false);
    });

    // Keep the canvas sized when the container changes (e.g. phone rotation).
    const ro = new ResizeObserver(() => map.resize());
    ro.observe(box.current);
    mapRef.current = map;
    const markersMap = markerRefs.current;
    return () => {
      ro.disconnect();
      markersMap.forEach((v) => v.anim && cancelAnimationFrame(v.anim));
      markersMap.clear();
      radarRef.current = null;
      ready.current = false;
      map.remove();
      mapRef.current = null;
    };
    // The map is created once; later prop changes are applied by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function syncShapes(map: maplibregl.Map) {
    if (!ready.current) return;
    const { route: r, line: l, accuracyM: acc, markers: ms } = latest.current;
    (map.getSource('route') as GeoJSONSource | undefined)?.setData(r && r.length > 1 ? lineFeature(r) : EMPTY);
    (map.getSource('line') as GeoJSONSource | undefined)?.setData(!(r && r.length > 1) && l ? lineFeature(l) : EMPTY);
    const pin = ms.find((m) => m.kind === 'pin');
    (map.getSource('accuracy') as GeoJSONSource | undefined)?.setData(pin && acc && acc > 5 ? circle(pin, Math.min(acc, 500)) : EMPTY);
  }

  function fit(map: maplibregl.Map, animate = true) {
    const { markers: ms, route: r, center: c } = latest.current;
    if (!fitToMarkers) {
      map.easeTo({ center: [c.lng, c.lat], duration: animate ? 600 : 0 });
      return;
    }
    const pts = [...ms.map((m) => [m.lng, m.lat] as [number, number]), ...(r ?? []).map((p) => [p.lng, p.lat] as [number, number])];
    if (pts.length === 0) return;
    if (pts.length === 1) {
      map.easeTo({ center: pts[0], zoom: Math.max(map.getZoom(), 15), duration: animate ? 800 : 0 });
      return;
    }
    const b = pts.reduce((acc, p) => acc.extend(p), new maplibregl.LngLatBounds(pts[0], pts[0]));
    map.fitBounds(b, { padding: 60, maxZoom: 16, duration: animate ? 900 : 0 });
  }

  // ---- Markers (pro pin glides to its new spot) ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const refs = markerRefs.current;
    const seen = new Set<string>();
    for (const m of markers) {
      seen.add(m.id);
      const existing = refs.get(m.id);
      if (!existing || existing.kind !== m.kind) {
        existing?.m.remove();
        const mk = new maplibregl.Marker({
          element: markerEl(m.kind),
          anchor: m.kind === 'pin' ? 'bottom' : 'center',
          draggable: m.kind === 'pin' && Boolean(onPickRef.current),
        })
          .setLngLat([m.lng, m.lat])
          .addTo(map);
        if (m.kind === 'pin') {
          mk.on('dragend', () => {
            const ll = mk.getLngLat();
            onPickRef.current?.({ lat: ll.lat, lng: ll.lng });
          });
        }
        refs.set(m.id, { m: mk, kind: m.kind });
        continue;
      }
      const from = existing.m.getLngLat();
      if (Math.abs(from.lat - m.lat) < 1e-7 && Math.abs(from.lng - m.lng) < 1e-7) continue;
      if (existing.anim) cancelAnimationFrame(existing.anim);
      if (m.kind !== 'pro' || reducedMotion()) {
        existing.m.setLngLat([m.lng, m.lat]);
        continue;
      }
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / GLIDE_MS);
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease in-out
        existing.m.setLngLat([from.lng + (m.lng - from.lng) * e, from.lat + (m.lat - from.lat) * e]);
        existing.anim = t < 1 ? requestAnimationFrame(step) : undefined;
      };
      existing.anim = requestAnimationFrame(step);
    }
    for (const [id, v] of refs) {
      if (!seen.has(id)) {
        if (v.anim) cancelAnimationFrame(v.anim);
        v.m.remove();
        refs.delete(id);
      }
    }
    syncShapes(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers.map((m) => `${m.id}:${m.kind}:${m.lat.toFixed(6)},${m.lng.toFixed(6)}`).join('|')]);

  // ---- Route / line / accuracy ----
  const routeKey = route ? `${route.length}:${route[0]?.lat},${route[route.length - 1]?.lng}` : '';
  const lineKey = line ? `${line[0].lat},${line[0].lng},${line[1].lat},${line[1].lng}` : '';
  useEffect(() => {
    const map = mapRef.current;
    if (map) syncShapes(map);
     
  }, [routeKey, lineKey, accuracyM]);

  // ---- Camera: refit only when the set of points meaningfully changes ----
  const fitKey = fitToMarkers
    ? [...markers.map((m) => `${m.id}:${m.lat.toFixed(3)},${m.lng.toFixed(3)}`), route ? route.length : 0].join('|')
    : `${center.lat.toFixed(6)},${center.lng.toFixed(6)}`;
  useEffect(() => {
    const map = mapRef.current;
    if (map && ready.current) fit(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey]);

  // ---- Radar rings while searching ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    radarRef.current?.remove();
    radarRef.current = null;
    if (radar) {
      const el = document.createElement('div');
      el.style.pointerEvents = 'none';
      el.style.zIndex = '1';
      el.innerHTML = '<div class="hf-radar"><span></span><span></span><span></span></div>';
      radarRef.current = new maplibregl.Marker({ element: el }).setLngLat([radar.lng, radar.lat]).addTo(map);
    }
  }, [radar?.lat, radar?.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={box} className={`hf-map overflow-hidden ${className}`} />;
}
