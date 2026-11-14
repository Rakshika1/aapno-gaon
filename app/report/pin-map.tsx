'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { Map, Marker, NavigationControl } from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';

type Point = { latitude: number; longitude: number };

export default function PinMap({ center, onChange }: { center: Point | null; onChange: (point: Point) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const marker = useRef<Marker | null>(null);
  const change = useRef(onChange);
  const [failed, setFailed] = useState(false);

  useEffect(() => { change.current = onChange; }, [onChange]);
  useEffect(() => {
    if (!container.current) return;
    let instance: Map;
    try {
      instance = new Map({
        container: container.current, center: [78.9, 22.8], zoom: 4, maxZoom: 19,
        renderWorldCopies: false, cooperativeGestures: true,
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
      return;
    }
    map.current = instance;
    instance.once('error', () => setFailed(true));
    instance.addControl(new NavigationControl());
    instance.on('click', ({ lngLat }) => change.current({ latitude: lngLat.lat, longitude: lngLat.wrap().lng }));
    return () => { marker.current?.remove(); marker.current = null; map.current = null; instance.remove(); };
  }, []);

  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    if (!center) {
      marker.current?.remove();
      marker.current = null;
      return;
    }
    const coords: [number, number] = [center.longitude, center.latitude];
    if (!marker.current) {
      marker.current = new Marker({ draggable: true }).setLngLat(coords).addTo(instance);
      marker.current.on('dragend', () => {
        const point = marker.current?.getLngLat().wrap();
        if (point) change.current({ latitude: point.lat, longitude: point.lng });
      });
    }
    marker.current.setLngLat(coords);
    instance.jumpTo({ center: coords, zoom: Math.max(instance.getZoom(), 14) });
  }, [center]);

  return <><div className="pin-map" ref={container} aria-label="Issue location map" />
    {failed && <p role="status">Map tiles may be unavailable. You can still report using a landmark.</p>}</>;
}
