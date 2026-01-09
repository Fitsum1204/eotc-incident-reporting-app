// app/api/register/route.ts
import bcrypt from "bcryptjs";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { USER_BY_EMAIL_QUERY } from "@/sanity/lib/queries";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return Response.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const existingUser = await client
    .withConfig({ useCdn: false })
    .fetch(USER_BY_EMAIL_QUERY, { email });

  if (existingUser) {
    return Response.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await writeClient.create({
    _type: "user",
    name,
    email,
    password: hashedPassword,
    provider: "credentials",
    role: "user",
  });

  return Response.json({ success: true });
}
