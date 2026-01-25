"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import { writeClient } from "@/sanity/lib/write-client";
import { v4 as uuidv4 } from 'uuid';

// Notify subscribed admins about a new incident
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


