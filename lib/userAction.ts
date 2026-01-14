// components/admin/user-actions.ts
"use server"

import { writeClient } from "@/sanity/lib/write-client"
import { auth } from "@/auth"

export async function updateUserRole(userId: string, role: "admin" | "user") {
  const session = await auth()
  if (!session?.user?.isAdmin) throw new Error("Unauthorized")

  await writeClient.patch(userId).set({ role }).commit()
}




export async function toggleUserStatus(
  userId: string,
  isActive: boolean
) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    throw new Error("Unauthorized")
  }

  await writeClient
    .patch(userId)
    .set({ isActive })
    .commit()
}
