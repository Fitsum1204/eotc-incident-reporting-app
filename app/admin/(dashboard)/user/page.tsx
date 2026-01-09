// app/admin/users/page.tsx
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import UsersTable from "@/components/shared/UsersTable"

export default async function AdminUsersPage() {
  const session = await auth()

  if (!session) redirect("/api/auth/signin")
  if (!session.user.isAdmin) redirect("/")


    
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      <UsersTable />
    </div>
  )
}
