// app/actions/updateIncidentStatus.ts
//"use server";

/* import { writeClient } from "@/sanity/lib/write-client";

export async function updateIncidentStatus(
  id: string,
  verification: "verified" | "rejected"
) {
  if (!id) throw new Error("Incident ID is required");

  await writeClient.patch(id).set({ verification }).commit();

  return { success: true };
} */

  "use server";

import { writeClient } from "@/sanity/lib/write-client";
import { sendPush } from "@/lib/push-service";

export async function updateIncidentStatus(
  id: string,
  verification: "verified" | "rejected"
) {
  if (!id) throw new Error("Incident ID is required");

  // 1. Update the status in Sanity
  // We use .commit() and return the document to get the author reference and title
  const updatedIncident = await writeClient
    .patch(id)
    .set({ verification })
    .commit();

  // 2. Determine Notification details
  const isVerified = verification === "verified";
  const type = isVerified ? "INCIDENT_APPROVED" : "INCIDENT_REJECTED";
  const statusText = isVerified ? "Approved" : "Rejected";
  
  // 3. Send Push Notification to the Author
  if (updatedIncident.author?._ref) {
    try {
      await sendPush({
        userIds: [updatedIncident.author._ref], // Targeting the specific user
        title: `Incident ${statusText}`,
        body: `Your incident "${updatedIncident.title}" has been ${verification}.`,
        url: `/incidents/${id}`, // Link to the specific incident detail page
        type: type,
      });
    } catch (pushError) {
      console.error("Failed to send push notification:", pushError);
      // We don't throw here so the UI still shows the status update was successful
    }
  }

  return { success: true };
}