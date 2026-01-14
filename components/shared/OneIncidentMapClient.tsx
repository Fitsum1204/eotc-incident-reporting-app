"use client"

import dynamic from "next/dynamic"

import { Incident } from "@/sanity/types";

const OneIncidentMap = dynamic(
  () => import("./OneIncidentMap"),
  { ssr: false }
)

type Props = {
  incident: Incident;
  height?: string;
  zoom?: number;
};
export default function  OneIncidentMapClient(props: Props) {
  return <OneIncidentMap  {...(props as any)} />
}


