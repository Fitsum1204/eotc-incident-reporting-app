"use client"

import dynamic from "next/dynamic"
import { LatLngExpression } from "leaflet"
import { Incident } from "@/sanity/types";

const IncidentMap = dynamic(
  () => import("./IncidentMap"),
  { ssr: false }
)
type Props = {
  incidents: Incident[];
  center?: LatLngExpression;
  height?: string;
  zoom?: number;
};

export default function  IncidentMapClient(props: Props) {
  return <IncidentMap {...(props as any)} />
}
