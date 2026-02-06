import { writeClient } from "@/sanity/lib/write-client";
import { getMessaging } from "@/lib/firebase-admin";

export async function updateIncidentStatus(
  id: string,
  verification: "verified" | "rejected"
) {
  if (!id) throw new Error("Incident ID is required");

  // 1. Fetch incident title and author to send notification
  const incident = await writeClient.fetch(
    `*[_type == "incident" && _id == $id][0]{
      title,
      author->{_id}
    }`,
    { id }
  );

  // 2. Update the status
  await writeClient.patch(id).set({ verification }).commit();

  // 3. Send Notification to the Reporter
  if (incident?.author?._id) {
    try {
      // Find subscriptions for this user
      const subscriptions = await writeClient.fetch(
        `*[_type == "pushSubscription" && user._ref == $userId]`,
        { userId: incident.author._id }
      );

      if (subscriptions && subscriptions.length > 0) {
        const messaging = getMessaging();
        const title = "Incident Status Updated";
        const body = `Your report "${incident.title || "Incident"}" has been marked as ${verification}.`;
        const url = `/incidents/${id}`;

        const sendPromises = subscriptions.map(async (sub: any) => {
          if (!sub.token) return;
          try {
            await messaging.send({
              token: sub.token,
              data: {
                title,
                body,
                url,
                type: "INCIDENT_UPDATE",
                incidentId: id,
              },
              webpush: {
                headers: { Urgency: "high" },
              },
            });
          } catch (error: any) {
            console.error("Failed to send update notification:", error);
            // Cleanup invalid tokens
            if (
              error.code === "messaging/registration-token-not-registered" ||
              error.code === "messaging/invalid-registration-token"
            ) {
              await writeClient.delete(sub._id).catch(console.error);
            }
          }
        });

        await Promise.allSettled(sendPromises);
      }
    } catch (error) {
      console.error("Error sending status update notification:", error);
    }
  }

  return { success: true };
}