"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Use the imported type — do NOT redeclare it here
// import { IncidentRow } from "./types";

// Extended type with required fields
export type IncidentRow = {
  _id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  image?: string;
  authorName?: string;
  verification: "pending" | "verified" | "rejected";
  // Callback to handle status update — passed from parent
  onUpdateStatus?: (verification: "verified" | "rejected") => void;
};

export const columns: ColumnDef<IncidentRow>[] = [
  // Selection column first (standard placement)
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const src = row.original.image || "/incidentbg.jpg";
      return (
        <Image
          src={src}
          alt="Incident"
          width={60}
          height={40}
          className="rounded-md object-cover"
        />
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
  },
 {
  accessorKey: "date",
  header: "Date",
  filterFn: (row, id, value) => {
    const rowDate = new Date(row.getValue(id));
    const now = new Date();

    if (value === "7") {
      return rowDate >= new Date(now.setDate(now.getDate() - 7));
    }

    if (value === "30") {
      return rowDate >= new Date(now.setDate(now.getDate() - 30));
    }

    return true;
  },
}
,
  {
    accessorKey: "authorName",
    header: "Reported By",
  },
  {
    accessorKey: "verification",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.verification;
      return (
        <span
          className={`capitalize font-medium ${
            status === "pending"
              ? "text-yellow-600"
              : status === "verified"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const incident = row.original;

      if (incident.verification !== "pending") {
        return <span className="text-gray-500">No actions</span>;
      }

      return (
        <div className="flex gap-2">
          <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation() // stop row click
                incident.onUpdateStatus?.("verified")
              }}
            >
              Verify
           </Button>
          <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                incident.onUpdateStatus?.("rejected")
              }}
            >
              Reject
          </Button>

        </div>
      );
    },
  },
];