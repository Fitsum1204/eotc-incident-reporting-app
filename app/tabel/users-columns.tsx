import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export type User = {
  _id: string;
  _type: "user";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  googleId?: string;
  name?: string;
  email?: string;
  image?: string;
  isActive?: boolean;
  role?: "admin" | "user";
  onUpdateStatus?: (isActive: boolean) => void;
};

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => (
      <Image
        src={row.original.image || "/avatar.png"}
        alt=""
        width={32}
        height={32}
        className="rounded-full"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) =>
      row.original.isActive ? (
        <span className="text-green-600">Active</span>
      ) : (
        <span className="text-red-600">Disabled</span>
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className="flex gap-2">
          {/* <Button size="sm" variant="outline">
            {user.role === "admin" ? "Demote" : "Promote"}
          </Button> */}
          <Button size="sm" variant="destructive"  onClick={() => user.onUpdateStatus?.(!user.isActive)}>
            {user.isActive ? "Disable" : "Enable"}
          </Button>
        </div>
      )
    },
  },
]
