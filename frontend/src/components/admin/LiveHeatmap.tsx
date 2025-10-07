// src/components/admin/LiveHeatmap.tsx

import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LiveHeatmapProps {
  currentCount: number;
  location?: string;
}

const LiveHeatmap: React.FC<LiveHeatmapProps> = ({ currentCount, location }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  // This ref will now only be used to check if the map has been created.
  const mapInstanceRef = useRef<L.Map | null>(null);

  // --- THIS useEffect IS NOW CORRECTED ---
  useEffect(() => {
    // If the map container doesn't exist yet, do nothing.
    if (!mapRef.current) {
      return;
    }
    // If the map instance has already been created, do nothing.
    if (mapInstanceRef.current) {
        return;
    }

    // Initialize Leaflet map and store the instance.
    const map = L.map(mapRef.current).setView([20.8880, 70.4013], 16); // Correct Somnath Temple coordinates
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // The cleanup function is crucial. It runs when the component unmounts.
    return () => {
        map.remove();
        mapInstanceRef.current = null;
    };
  }, []); // The empty dependency array is correct.

  // The second useEffect for updating data remains the same.
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    const locations = [
      { id: 'main_entrance', lat: 20.8880, lon: 70.4013, name: 'Main Entrance' },
      { id: 'sabha_mandap', lat: 20.8882, lon: 70.4015, name: 'Sabha Mandap' },
      { id: 'nritya_mandap', lat: 20.8878, lon: 70.4011, name: 'Nritya Mandap' },
    ];

    locations.forEach((loc) => {
      const isCurrentLocation = loc.id === location;
      const intensity = isCurrentLocation ? currentCount : Math.floor(currentCount * 0.3);

      let color = '#4CAF50';
      if (intensity > 150) color = '#FF9800';
      if (intensity > 300) color = '#F44336';
      if (intensity > 500) color = '#9C27B0';

      const radius = Math.max(10, Math.min(30, intensity / 20));

      const circle = L.circleMarker([loc.lat, loc.lon], {
        radius,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(mapInstanceRef.current!);

      circle.bindPopup(`
        <strong>${loc.name}</strong><br/>
        Current Count: ${intensity}<br/>
        Status: ${isCurrentLocation ? 'Live Data' : 'Estimated'}
      `);
    });
  }, [currentCount, location]);

  return (
    <Box
      ref={mapRef}
      sx={{
        width: '100%',
        height: 400,
        borderRadius: 1,
        overflow: 'hidden',
      }}
    />
  );
};

export default LiveHeatmap;