"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  
} from "@/components/ui/dropdown-menu"
import {
  ColumnDef,
  flexRender,
   SortingState,
  getCoreRowModel,
   ColumnFiltersState,
   VisibilityState,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}


export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
const router = useRouter()
const [sorting, setSorting] = React.useState<SortingState>([])
const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
     const [rowSelection, setRowSelection] = React.useState({})
 
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
     onRowSelectionChange: setRowSelection,
    state: {
      sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
    }
  })

  return (
    <div className="p-2 ">
        <div className="flex gap-10 w-full  py-4">
            <Input
            placeholder="Filter location..."
            value={(table.getColumn("location")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("location")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
           <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">
      Status
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    {["all", "pending", "verified", "rejected"].map((status) => (
      <DropdownMenuCheckboxItem
        key={status}
        checked={
          status === "all"
            ? !table.getColumn("verification")?.getFilterValue()
            : table.getColumn("verification")?.getFilterValue() === status
        }
        onCheckedChange={() => {
          table
            .getColumn("verification")
            ?.setFilterValue(status === "all" ? undefined : status)
        }}
        className="capitalize"
      >
        {status}
      </DropdownMenuCheckboxItem>
    ))}
  </DropdownMenuContent>
              </DropdownMenu>
           <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">
      Category
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    {["Fire", "Mass Killing", "Abduction"].map((cat) => (
      <DropdownMenuCheckboxItem
        key={cat}
        checked={table.getColumn("category")?.getFilterValue() === cat}
        onCheckedChange={() =>
          table.getColumn("category")?.setFilterValue(cat)
        }
      >
        {cat}
      </DropdownMenuCheckboxItem>
    ))}
  </DropdownMenuContent>
               </DropdownMenu>
          <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">
      Date
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem
      onClick={() => table.getColumn("date")?.setFilterValue("7")}
    >
      Last 7 days
    </DropdownMenuItem>
    <DropdownMenuItem
      onClick={() => table.getColumn("date")?.setFilterValue("30")}
    >
      Last 30 days
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      onClick={() => table.getColumn("date")?.setFilterValue(undefined)}
    >
      Clear
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>  


        </div>
        <div className="overflow-hidden   rounded-md border-4 m-4">
            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id}>
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                        </TableHead>
                        )
                    })}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                   <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="text-wrap cursor-pointer hover:bg-muted/50"
                            onClick={() => {
                              const incidentId = (row.original as any)._id
                              router.push(`/admin/incident/${incidentId}`)
                            }}
                          >

                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
  {table.getFilteredSelectedRowModel().rows.length} of{" "}
  {table.getFilteredRowModel().rows.length} row(s) selected.
</div>
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            Previous
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            Next
            </Button>
        </div>
    </div>
  )
}