"use client"

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { useState } from "react"
import L from "leaflet"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

type Props = {
  onSelect: (lat: number, lng: number) => void
}

function ClickHandler({ onSelect }: Props) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function LocationPicker({ onSelect }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(null)

  return (
    <MapContainer
      center={[9.03, 38.74]} // Addis Ababa default
      zoom={12}
      className="h-64 w-full rounded-lg border"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickHandler
        onSelect={(lat, lng) => {
          setPosition([lat, lng])
          onSelect(lat, lng)
        }}
      />

      {position && <Marker position={position} />}
    </MapContainer>
  )
}
