// Distance and arrival-time helpers for live tracking (no paid map APIs).

export interface LatLng {
  lat: number;
  lng: number;
}

/** Default map centre: Thane, MMR. */
export const DEFAULT_CENTER: LatLng = { lat: 19.2183, lng: 72.9781 };

/** Professionals see requests within this radius. */
export const DISPATCH_RADIUS_KM = 10;

/** Straight-line distance in km (haversine). */
export function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Estimated travel time in minutes for a two-wheeler in city traffic.
 * Roads are ~35% longer than a straight line; average speed ~22 km/h; +1 min to park.
 */
export function etaMinutes(from: LatLng, to: LatLng): number {
  const roadKm = distanceKm(from, to) * 1.35;
  return Math.max(1, Math.round((roadKm / 22) * 60 + 1));
}

export function formatKm(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

/** Opens turn-by-turn directions in Google Maps (app on phones, website on desktop). Free, no API key. */
export function googleMapsDirectionsUrl(to: LatLng): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${to.lat},${to.lng}&travelmode=two-wheeler`;
}

export function isValidLatLng(lat: unknown, lng: unknown): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}
