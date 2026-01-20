"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import { writeClient } from "@/sanity/lib/write-client";
import { v4 as uuidv4 } from 'uuid';
import webpush from 'web-push';
// Notify subscribed admins about a new incident
/* async functiapplicationServerKey: vapidKey,on notifyAdminsAboutNewIncident(incidentData:  any) {
  try {
    // Try common subscription document shapes in Sanity. Adjust queries to match your schema.
    let adminSubscriptions: any[] = await writeClient.fetch(
      '*[_type == "pushSubscription" && role == "admin"]{subscription}'
    
    );

    if (!adminSubscriptions || adminSubscriptions.length === 0) {
      // Fallback: look for admin users with a `webPushSubscription` field
      adminSubscriptions = await writeClient.fetch(
        '*[_type == "user" && role == "admin" && defined(webPushSubscription)]{"subscription": webPushSubscription}'
      );
    }

    if (!adminSubscriptions || adminSubscriptions.length === 0) return;

    await Promise.all(
      adminSubscriptions.map(async (doc: any) => {
        const subscription = doc?.subscription || doc;
        if (!subscription) return;

        try {
          await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/push/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subscription,
              payload: {
                title: 'New Incident Reported',
                body: `${incidentData.title || 'No title'} - ${incidentData.location || ''}`,
                url: `/admin/incident/${incidentData._id}`,
                tag: 'new-incident',
              },
            }),
            // ensure server-side fetch doesn't use stale cache
            cache: 'no-store',
          });
        } catch (err) {
          console.error('Failed to send notification to a subscription', err);
        }
      })
    );
  } catch (error) {
    console.error('Error sending admin notifications:', error);
  }
} */
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:forfreef@gmail.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}
/* async function notifyAdminsAboutNewIncident(incident: any) {
  const subs = await writeClient.fetch(
    '*[_type=="pushSubscription" && role=="admin"]{subscription}'
  );

  if (!subs?.length) return;

  await Promise.allSettled(
    subs.map(async ({ subscription }: { subscription: any }) => {
      try {
        await fetch(`${process.env.NEXTAUTH_URL}/api/push/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({
            subscription,
            payload: {
              title: '🚨 New Incident Reported',
              body: incident.title,
              url: `/admin/incident/${incident._id}`,
              tag: 'incident',
            },
          }),
        });
      } catch (err) {
        console.error('Push send failed:', err);
      }
    })
  );
} */

async function notifyAdminsAboutNewIncident(incidentData: any) {
  try {
    // 1. Fetch all admin subscriptions from Sanity
    const adminSubscriptions = await writeClient.fetch(
      `*[_type == "pushSubscription" && role == "admin"]{subscription}`
    );

    if (!adminSubscriptions || adminSubscriptions.length === 0) return;

    // 2. Send to each subscription directly using webpush (Server-to-Push-Service)
    const notificationPromises = adminSubscriptions.map(async (doc: any) => {
      const sub = doc.subscription;
      if (!sub || !sub.endpoint) return;

      try {
        return await webpush.sendNotification(
          sub,
          JSON.stringify({
            title: '🚨 New Incident Reported',
            body: `${incidentData.title} at ${incidentData.location} `,
            data: { 
                url: `/admin/incident/${incidentData._id}` 
            },
            tag: incidentData._id,
          })
        );
      } catch (err: any) {
        // If subscription is expired/invalid, delete it from Sanity
        if (err.statusCode === 404 || err.statusCode === 410) {
          console.log("Removing expired subscription");
          // Add logic to delete stale sub if needed
        }
      }
    });

    await Promise.all(notificationPromises);
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


