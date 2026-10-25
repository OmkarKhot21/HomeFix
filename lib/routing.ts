import { distanceKm, etaMinutes, type LatLng } from '@/lib/geo';

// Road distance, travel time and route line between a professional and a home.
// Uses OSRM (free, OpenStreetMap roads, no API key). Point OSRM_URL at another
// OSRM-compatible server to switch providers. If routing fails, we fall back to
// the straight-line estimate so tracking never breaks.

const OSRM_URL = (process.env.OSRM_URL || 'https://router.project-osrm.org').replace(/\/$/, '');
const CACHE_MS = 30_000; // reuse a route for 30 s
const MIN_GAP_MS = 1_100; // the public server asks for at most ~1 request per second
const TIMEOUT_MS = 2_500;
// OSRM times assume empty roads; Indian city traffic is slower. +1 min to park.
const TRAFFIC_FACTOR = 1.3;

export interface RouteInfo {
  km: number;
  minutes: number;
  /** Points along the road, in order. Empty when we only have an estimate. */
  path: LatLng[];
  source: 'road' | 'estimate';
}

const cache = new Map<string, { at: number; route: RouteInfo }>();
// Last road route per destination: used when we can't fetch a fresh one, so the
// line doesn't flicker back to a straight estimate while the pro is moving.
const lastForDest = new Map<string, RouteInfo>();
let lastCall = 0;

const destKey = (to: LatLng) => `${to.lat.toFixed(5)},${to.lng.toFixed(5)}`;

/** A slightly old road route is better than a straight line, as long as the pro hasn't moved far. */
function fallback(from: LatLng, to: LatLng, hit?: RouteInfo): RouteInfo {
  if (hit) return hit;
  const prev = lastForDest.get(destKey(to));
  if (prev && prev.path.length > 1 && distanceKm(prev.path[0], from) < 0.5) return prev;
  return estimateRoute(from, to);
}

// ~100 m grid for the moving end, so small GPS jitter reuses the cached route.
const keyFor = (from: LatLng, to: LatLng) =>
  `${from.lat.toFixed(3)},${from.lng.toFixed(3)}>${to.lat.toFixed(5)},${to.lng.toFixed(5)}`;

export function estimateRoute(from: LatLng, to: LatLng): RouteInfo {
  return { km: distanceKm(from, to), minutes: etaMinutes(from, to), path: [], source: 'estimate' };
}

export async function getRoute(from: LatLng, to: LatLng): Promise<RouteInfo> {
  const key = keyFor(from, to);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.route;

  // Over the rate budget: serve the last route if we have one, else an estimate.
  if (Date.now() - lastCall < MIN_GAP_MS) return fallback(from, to, hit?.route);
  lastCall = Date.now();

  try {
    const url = `${OSRM_URL}/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson&alternatives=false&steps=false`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'User-Agent': 'HomeFix/1.0 (homefix-official.vercel.app)' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`OSRM ${res.status}`);
    const data = (await res.json()) as {
      code: string;
      routes?: { distance: number; duration: number; geometry: { coordinates: [number, number][] } }[];
    };
    const r = data.code === 'Ok' ? data.routes?.[0] : undefined;
    if (!r) throw new Error(`OSRM ${data.code}`);

    const route: RouteInfo = {
      km: r.distance / 1000,
      minutes: Math.max(1, Math.round((r.duration / 60) * TRAFFIC_FACTOR + 1)),
      path: r.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
      source: 'road',
    };
    cache.set(key, { at: Date.now(), route });
    lastForDest.set(destKey(to), route);
    if (cache.size > 500) cache.delete(cache.keys().next().value!);
    if (lastForDest.size > 500) lastForDest.delete(lastForDest.keys().next().value!);
    return route;
  } catch (err) {
    console.error('[ROUTING] falling back to estimate:', err instanceof Error ? err.message : err);
    return fallback(from, to, hit?.route);
  }
}
