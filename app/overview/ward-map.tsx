'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { LngLatBounds, Map, Marker } from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import type { WardSummary } from './page';

export default function WardMap({ wards, metric }: { wards: WardSummary[]; metric: 'pending' | 'received' | 'rate' }) {
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!container.current) return;
    let map: Map;
    try {
      map = new Map({
        container: container.current, center: [78.9, 22.8], zoom: 4, cooperativeGestures: true,
        style: {
          version: 8,
          sources: { basemap: {
            type: 'raster', tileSize: 256, maxzoom: 19,
            tiles: [process.env.NEXT_PUBLIC_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            attribution: process.env.NEXT_PUBLIC_MAP_ATTRIBUTION || '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          } },
          layers: [{ id: 'basemap', type: 'raster', source: 'basemap' }],
        },
      });
    } catch {
      queueMicrotask(() => setFailed(true));
      return;
    }
    const bounds = new LngLatBounds();
    const max = metric === 'rate' ? 100 : Math.max(1, ...wards.map(ward => ward[metric]));
    for (const ward of wards) {
      if (ward.latitude === null || ward.longitude === null) continue;
      const value = metric === 'rate' ? (ward.received ? Math.round(100 * ward.resolved / ward.received) : null) : ward[metric];
      const element = document.createElement('span');
      element.className = 'ward-marker';
      element.textContent = value === null ? '—' : value + (metric === 'rate' ? '%' : '');
      element.title = ward.name + ': ' + (value === null ? 'No reports' : element.textContent);
      element.style.backgroundColor = value ? `hsl(145 42% ${35 - 15 * value / max}%)` : '#51635c';
      const center: [number, number] = [ward.longitude, ward.latitude];
      bounds.extend(center);
      new Marker({ element }).setLngLat(center).addTo(map);
    }
    if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 40, maxZoom: 13, duration: 0 });
    map.once('error', () => setFailed(true));
    return () => map.remove();
  }, [wards, metric]);

  if (!wards.some(ward => ward.latitude !== null && ward.longitude !== null)) {
    return <p>Ward map locations haven’t been configured. Counts are available in the table.</p>;
  }
  return <figure>
    <div ref={container} className="pin-map" aria-label="Ward report totals map" />
    <figcaption>{failed ? 'The map could not load. See the table for ward totals.' : 'Markers show ward totals or rates. Darker markers indicate higher values.'}</figcaption>
  </figure>;
}
