"use client"

import { useEffect, useState } from "react"
import { sanityFetch } from "@/sanity/lib/client-fetch"
import { USERS_QUERY } from "@/sanity/lib/queries"
import { DataTable } from "@/app/tabel/data-table_users"
import { userColumns } from "@/app/tabel/users-columns"
import { is } from "zod/v4/locales"
import { toggleUserStatus } from "@/app/admin/(dashboard)/user/actions/page"
import { toast } from "sonner"

export default function UsersTable() {
  const [users, setUsers] = useState<any[]>([])

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await sanityFetch({ query: USERS_QUERY});
        const withHandlers = (data || []).map((inc: any) => ({
          ...inc,
          onUpdateStatus: async (isActive:boolean) =>
            handleUpdateStatus(inc._id, isActive),
        }));
        setUsers(withHandlers);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch Users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    isActive: boolean
  ) => {
    try {
      await toggleUserStatus(id, isActive); 

     
      setUsers((prev) =>
  prev.map((user) =>
    user._id === id ? { ...user, isActive } : user
  )
)


      toast.success(`User ${isActive}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  if (loading) return <p>Loading incidents...</p>;


  return <DataTable columns={userColumns} data={users} />
}
