'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Card } from '@/components/ui/card'; // or your UI library
import type { GeopointValue } from 'sanity';
import { set } from 'sanity';

function LocationMarker({ value, onChange }: { value?: GeopointValue; onChange: (val: GeopointValue) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(
    value ? [value.lat, value.lng] : null
  );

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onChange({ _type: 'geopoint', lat, lng });
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default function LeafletGeopointInput(props: any) {
  const { value, onChange } = props;

  const handleChange = (newValue: GeopointValue) => {
    onChange(set(newValue));
  };

  return (
    <Card className="p-4">
      <div className="h-96 w-full rounded-lg overflow-hidden">
        <MapContainer
          center={value ? [value.lat, value.lng] : [9.03, 38.74]}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          />
          <LocationMarker value={value} onChange={handleChange} />
        </MapContainer>
      </div>
      <p className="text-sm text-gray-600 mt-2">Click on the map to set location</p>
    </Card>
  );
}