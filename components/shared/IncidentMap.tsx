"use client";

import { incidentIcons } from "@/lib/incidentMarkers"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
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
  incidents: Incident[];
  center?: LatLngExpression;
 
  height?: string;
  zoom?: number;
};

export default function IncidentMap({
  incidents,
  center = [9.03, 38.74],
  zoom = 5,
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

  const validIncidents = incidents.filter(
    (i) => i.locationPoint?.lat && i.locationPoint?.lng
  );

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

      <MarkerClusterGroup chunkedLoading>
        {validIncidents.map((incident) => (
          
            <Marker
                key={incident._id}
                position={[
                  incident.locationPoint!.lat,
                  incident.locationPoint!.lng,
                ]}
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

                <button
                  className="mt-2 mx-2 text-sm text-blue-600 underline cursor-pointer"
                  onClick={() => router.push(`/admin/incident/${incident._id}`)}
                >
                  View details
                </button>
                 <span className="text-sm text-muted-foreground mx-2">
                  Status: 
                   <b className={`
                          ${incident.verification === 'pending' ? 'text-amber-600' : ''}
                          ${incident.verification === 'verified' ? 'text-green-600' : ''}
                          ${incident.verification === 'rejected' ? 'text-red-600' : ''}
                        `}>
                      {incident.verification}
                   </b>
                 
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
