"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import { writeClient } from "@/sanity/lib/write-client";
import { v4 as uuidv4 } from "uuid";

export const createPitch = async (state: any, form: FormData) => {
  const session = await auth();

  if (!session?.user?.email) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  const title = form.get("title") as string;
  const description = form.get("description") as string;
  const location = form.get("location") as string;
  const date = form.get("date") as string;
  const category = form.get("type") as string;

  const lat = Number(form.get("lat"));
  const lng = Number(form.get("lng"));

  const attachments = form.getAll("attachments[]") as File[];

  const attachmentsRefs: any[] = [];

  try {
    // Upload attachments
    for (const file of attachments) {
      if (!file || file.size === 0) continue;

      const uploaded = await writeClient.assets.upload("image", file, {
        filename: file.name,
      });

      attachmentsRefs.push({
        _type: "image",
        asset: {
          _type: "reference",
          _ref: uploaded._id,
        },
        _key: uuidv4(),
      });
    }

    const incident = await writeClient.create({
      _type: "incident",
      title,
      description,
      location,
      date,
      category,
      attachments: attachmentsRefs,
      locationPoint:
        Number.isFinite(lat) && Number.isFinite(lng)
          ? { lat, lng }
          : undefined,
      reporterEmail: session.user.email,
      reporterName: session.user.name,
      verification: "pending",
    });

    return parseServerActionResponse({
      ...incident,
      reporterEmail: session.user.email,
      reporterName: session.user.name,
      status: "SUCCESS",
      error: "",
    });
  } catch (error) {
    console.error(error);
    return parseServerActionResponse({
      error: "Failed to create incident",
      status: "ERROR",
    });
  }
};
