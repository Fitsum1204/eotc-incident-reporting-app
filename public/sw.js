// lib/actions.ts
import { getMessaging } from "@/lib/firebase-admin";

async function notifyAdminsAboutNewIncident(incidentData: any) {
  try {
    const adminSubscriptions = await writeClient.fetch(
      `*[_type == "pushSubscription" && role == "admin"]{token}`
    );

    if (!adminSubscriptions || adminSubscriptions.length === 0) return;

    const messaging = getMessaging();

    const notificationPromises = adminSubscriptions.map(async (doc: any) => {
      const token = doc.token;
      if (!token) return;

      try {
        await messaging.send({
          token: token,
          // CRITICAL: No 'notification' field here. Use 'data' only.
          data: {
            title: incidentData.title || '🚨 New Incident Reported',
            body: `Incident at ${incidentData.location || 'Unknown location'}`,
            url: `/admin/incident/${incidentData._id}`,
            incidentId: incidentData._id,
          },
          android: {
            priority: 'high',
          },
          webpush: {
            headers: {
              Urgency: 'high', // Wakes up the browser/phone
            },
            fcmOptions: {
              link: `/admin/incident/${incidentData._id}`,
            },
          },
        });
      } catch (err: any) {
        console.error('FCM send failed for token:', token, err);
      }
    });

    await Promise.allSettled(notificationPromises);
  } catch (error) {
    console.error('Push notification error:', error);
  }
}