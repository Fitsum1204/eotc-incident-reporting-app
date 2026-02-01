"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import { writeClient } from "@/sanity/lib/write-client";
import { v4 as uuidv4 } from 'uuid';
// lib/actions.ts
import { getMessaging } from "@/lib/firebase-admin";

// ... (other imports)

// Notify subscribed admins about a new incident
async function notifyAdminsAboutNewIncident(incidentData: {
  _id: string;
  title?: string;
  location?: string;
}) {
  try {
    console.log('🔔 Notifying admins about new incident:', incidentData._id);

    // 1. Fetch all admin subscriptions from Sanity (include _id for cleanup)
    const adminSubscriptions = await writeClient.fetch<Array<{
      _id: string;
      token?: string;
    }>>(
      `*[_type == "pushSubscription" && role == "admin"]{_id, token}`
    );

    if (!adminSubscriptions || adminSubscriptions.length === 0) {
      console.warn('⚠️ No admin subscriptions found');
      return;
    }

    console.log(`📤 Found ${adminSubscriptions.length} admin subscription(s)`);

    const messaging = getMessaging();
    const title = incidentData.title || 'New Incident';
    const body = `${incidentData.title || 'Incident'} at ${incidentData.location || 'Unknown location'}`;
    const url = `/admin/incident/${incidentData._id}`;

    // 2. Send to each subscription directly using Firebase Admin
    const notificationPromises = adminSubscriptions.map(async (doc) => {
      const token = doc.token;
      if (!token) {
        console.warn('⚠️ Subscription missing token:', doc._id);
        return;
      }

      try {
        await messaging.send({
          token,
          notification: {
            title,
            body,
          },
          data: {
            url,
            type: 'NEW_INCIDENT',
            incidentId: incidentData._id,
          },
          webpush: {
            notification: {
              title,
              body,
              icon: '/icon-192.png',
              badge: '/icon-192.png',
              requireInteraction: true,
            },
            data: {
              url,
              type: 'NEW_INCIDENT',
            },
            headers: {
              Urgency: 'high',
            },
          },
        });

        console.log('✅ FCM notification sent successfully to:', token.substring(0, 20) + '...');
      } catch (err: unknown) {
        const error = err as { code?: string; message?: string };
        console.error('❌ FCM send failed for token:', token.substring(0, 20) + '...', error.message || error);

        // If token is invalid (unregistered), delete from Sanity
        if (error.code === 'messaging/registration-token-not-registered' || 
            error.code === 'messaging/invalid-registration-token') {
          console.log('🗑️ Removing expired/invalid token:', doc._id);
          try {
            await writeClient.delete(doc._id);
          } catch (deleteErr) {
            console.error('Failed to delete expired subscription:', deleteErr);
          }
        }
      }
    });

    const results = await Promise.allSettled(notificationPromises);
    const successCount = results.filter((r) => r.status === 'fulfilled').length;
    console.log(`✅ Sent ${successCount}/${adminSubscriptions.length} notifications`);
  } catch (error: unknown) {
    console.error('❌ Error sending admin notifications:', error);
  }
}
export const createPitch = async (state: any, form: FormData) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }
  const reporterEmail = session.user.email || null; 
  const reporterName = session.user.name || "Anonymous Reporter";
  const reporterImage = session.user.image || null;
  const title = form.get("title") as string;
  const description = form.get("description") as string;
  const location = form.get("location") as string;
  const date = form.get("date") as string;
  const lat = Number(form.get("lat"));
  const lng = Number(form.get("lng"));


  //  Read file inputs
  const mainImage = form.get("image") as File | null;
  const attachments = form.getAll("attachments") as File[];

  let mainImageRef = null;
  const attachmentsRefs: any[] = [];

  try {
    //  Upload main image if exists
    if (mainImage && mainImage.size > 0) {
      const uploadedImage = await writeClient.assets.upload(
        "image",
        mainImage,
        { filename: mainImage.name },
        
      );

      mainImageRef = {
        _type: "image",
        asset: { _type: "reference", _ref: uploadedImage._id },
        _key: uuidv4()
      };
    }

    // Upload attachments (files + images)
    for (const file of attachments) {
      if (file.size === 0) continue;

      const type = file.type.startsWith("image") ? "image" : "file";

      const uploaded = await writeClient.assets.upload(type, file, {
        filename: file.name,
      });

      attachmentsRefs.push({
        _type: type,
        asset: { _type: "reference", _ref: uploaded._id },
      });
    }

    //  Create document
    const incident = await writeClient.create({
      _type: "incident",
      title,
      description,
      location,
      date,
      category: form.get("type") as string,
      image: mainImageRef,
      attachments: attachmentsRefs,
      author: {
        _type: "reference",
        _ref: session.user?.id,
      },
      reporterEmail,
      verification: 'pending',
      locationPoint:
        Number.isFinite(lat) && Number.isFinite(lng)
          ? { lat, lng }
          : undefined,
    });

    // Send notifications to admins (best-effort)
    try {
      await notifyAdminsAboutNewIncident(incident);
    } catch (err) {
      console.error('notifyAdminsAboutNewIncident error:', err);
    }

    return parseServerActionResponse({
     ...incident,
      reporterEmail,        
      reporterName,
      status: "SUCCESS",
      error: "",
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};


