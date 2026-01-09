"use client";

import { incidentIcons } from "@/lib/incidentMarkers";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useEffect } from "react";
import L from "leaflet";
import { useRouter } from "next/navigation";

type Incident = {
  _id: string;
  title: string;
  category: string;
  verification: "pending" | "verified" | "rejected";
  locationPoint?: {
    lat: number;
    lng: number;
  };
};

type Props = {
  incident: Incident;
  height?: string;
  zoom?: number;
};

export default function IncidentMap({
  incident,
  zoom = 7,
  height = "500px",
}: Props) {
  const router = useRouter();

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/marker-icon-2x.png",
      iconUrl: "/marker-icon.png",
      shadowUrl: "/marker-shadow.png",
    });
  }, []);

  if (!incident.locationPoint) return null;

  const center: LatLngExpression = [
    incident.locationPoint.lat,
    incident.locationPoint.lng,
  ];

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <Marker
        position={center}
        icon={
          incidentIcons[incident.verification] ??
          incidentIcons.default
        }
      >
        <Popup>
          <div className="space-y-1">
            <strong className="block">{incident.title}</strong>

            <span className="text-sm text-muted-foreground">
              {incident.category}
            </span>

            <div className="text-sm">
              Status:{" "}
              <b
                className={`capitalize
                  ${
                    incident.verification === "pending"
                      ? "text-amber-600"
                      : incident.verification === "verified"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                `}
              >
                {incident.verification}
              </b>
            </div>

            <button
              className="mt-2 text-sm text-blue-600 underline"
              onClick={() =>
                router.push(`/admin/incident/${incident._id}`)
              }
            >
              View details
            </button>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
