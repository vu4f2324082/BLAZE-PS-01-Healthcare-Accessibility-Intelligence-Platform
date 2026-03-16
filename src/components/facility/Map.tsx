'use client';

import { useEffect, useState } from 'react';
import { Facility } from '@/types';

interface MapProps {
  facilities: Facility[];
  centerLat?: number | null;
  centerLng?: number | null;
}

export default function LeafletMap({ facilities, centerLat, centerLng }: MapProps) {
  const [MapComponents, setMapComponents] = useState<any>(null);

  // Dynamically import Leaflet only on client — prevents SSR crash
  useEffect(() => {
    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
    ]).then(([L, RL]) => {
      // Fix default Leaflet icon paths (broken by webpack)
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
      setMapComponents({ L: L.default, ...RL });
    });
  }, []);

  const getMarkerColor = (score: number) => {
    if (score >= 70) return '#16a34a';   // green
    if (score >= 40) return '#d97706';   // yellow
    return '#dc2626';                     // red
  };

  if (!MapComponents) {
    return (
      <div className="w-full h-full min-h-[500px] bg-slate-200 animate-pulse rounded-2xl flex items-center justify-center">
        <span className="text-slate-500 font-semibold">Loading Interactive Map...</span>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, CircleMarker } = MapComponents;
  const defaultLat = centerLat || 19.07;
  const defaultLng = centerLng || 72.87;

  return (
    <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      <MapContainer
        center={[defaultLat, defaultLng]}
        zoom={12}
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />

        {facilities.map((fac) => (
          <CircleMarker
            key={fac.id}
            center={[fac.lat, fac.lng]}
            radius={14}
            pathOptions={{
              fillColor: getMarkerColor(fac.accessibility_score),
              color: '#ffffff',
              weight: 2,
              fillOpacity: 0.9,
            }}
          >
            <Popup>
              <div className="p-1 min-w-[180px]">
                <div className="font-bold text-slate-900 text-sm mb-1">{fac.name}</div>
                <div className="text-xs text-slate-500 mb-2">{fac.type}</div>
                <div
                  className="text-xs font-bold mb-3"
                  style={{ color: getMarkerColor(fac.accessibility_score) }}
                >
                  Score: {fac.accessibility_score}%
                </div>
                <a
                  href={`/facilities/${fac.id}`}
                  className="block text-center bg-blue-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-blue-700"
                >
                  View Details →
                </a>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
