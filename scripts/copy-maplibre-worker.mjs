// Copies MapLibre's background worker into public/ so the browser can load it.
// MapLibre 6 can't find its worker inside the Next.js bundle; MapLibreMap.tsx points it here.
// Runs automatically before `npm run dev` and `npm run build`.
import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules', 'maplibre-gl', 'dist', 'maplibre-gl-worker.mjs');
const outDir = join(root, 'public', 'maplibre');
mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, 'maplibre-gl-worker.mjs'));
console.log('[maplibre] worker copied to public/maplibre/');
