import { NextResponse } from "next/server";
import {  client } from "@/sanity/lib/client";
import { USER_BY_EMAIL_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await client
      .withConfig({ useCdn: false })
      .fetch(USER_BY_EMAIL_QUERY, { email });

    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }
    function sanitizeId(email: string) {
  return `user_${email.replace(/[@.]/g, "_")}`;
}
const id = sanitizeId(email);
    // Create admin user in Sanity
    await writeClient.createIfNotExists({
      _id: id ,
      _type: "user",
      name,
      email,
      password, 
      role: "admin",
      provider: "credentials",
    });

    return NextResponse.json({ message: "Admin registered successfully" }, { status: 201 });
  } catch (err: any) {
    console.error("Admin register error:", err);
    return NextResponse.json({ message: "Failed to register" }, { status: 500 });
  }
}
