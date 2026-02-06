// app/actions/updateIncidentStatus.ts
"use server";

import { writeClient } from "@/sanity/lib/write-client";

export async function updateIncidentStatus(
  id: string,
  verification: "verified" | "rejected"
) {
  if (!id) throw new Error("Incident ID is required");

  await writeClient.patch(id).set({ verification }).commit();

  return { success: true };
}