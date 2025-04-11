"use client";

import { Circle, CircleDot, CircleSlash, MoreHorizontal } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import {
  DataTable,
  DataTableColumnFilter,
  DataTableContent,
  DataTableHeader,
  DataTablePagination,
  type Column,
} from "./data-table";
import { Badge } from "./ui/badge";

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
};

export const columns: Column<InventoryItem>[] = [
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
    accessorKey: "id",
    enableSorting: true,
    header: "SKU",
    cell: ({ row }) => {
      const sku = row.getValue("id") as string;
      return <div className="font-semibold">{sku}</div>;
    },
  },
  {
    accessorKey: "name",
    enableSorting: true,
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const Icon =
        status === "in-stock"
          ? CircleDot
          : status === "low-stock"
          ? Circle
          : CircleSlash;
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <Icon
            className={cn(
              "h-2.5 w-2.5 rounded-full mr-1",
              status === "in-stock"
                ? "text-green-500"
                : status === "low-stock"
                ? "text-muted-foreground"
                : "text-red-500"
            )}
          />
          {status === "in-stock"
            ? "In Stock"
            : status === "low-stock"
            ? "Low Stock"
            : "Out of Stock"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "category",
    enableSorting: true,
    header: "Category",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    isNumeric: true,
    enableSorting: true,
    cell: ({ row }) => {
      const quantity = Number.parseFloat(row.getValue("quantity"));
      return <div className="text-right font-medium">{quantity}</div>;
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    isNumeric: true,
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(item.id)}
            >
              Copy item ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit item</DropdownMenuItem>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Update stock</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export interface InventoryTableProps {
  data?: InventoryItem[];
}

export default function InventoryTable({
  data = inventoryData,
}: InventoryTableProps) {
  return (
    <DataTable columns={columns} data={data}>
      <DataTableHeader>
        <DataTableColumnFilter />
      </DataTableHeader>
      <DataTableContent />
      <DataTablePagination />
    </DataTable>
  );
}

const inventoryData: InventoryItem[] = [
  {
    id: "INV001",
    name: "Wireless Headphones",
    category: "Electronics",
    quantity: 45,
    price: 89.99,
    status: "in-stock",
  },
  {
    id: "INV002",
    name: "Ergonomic Keyboard",
    category: "Electronics",
    quantity: 32,
    price: 129.99,
    status: "in-stock",
  },
  {
    id: "INV003",
    name: "Desk Lamp",
    category: "Home Office",
    quantity: 8,
    price: 34.5,
    status: "low-stock",
  },
  {
    id: "INV004",
    name: "Notebook Set",
    category: "Stationery",
    quantity: 0,
    price: 12.99,
    status: "out-of-stock",
  },
  {
    id: "INV005",
    name: "Wireless Mouse",
    category: "Electronics",
    quantity: 24,
    price: 45.0,
    status: "in-stock",
  },
  {
    id: "INV006",
    name: "USB-C Hub",
    category: "Electronics",
    quantity: 5,
    price: 59.99,
    status: "low-stock",
  },
  {
    id: "INV007",
    name: "Monitor Stand",
    category: "Home Office",
    quantity: 18,
    price: 79.99,
    status: "in-stock",
  },
  {
    id: "INV008",
    name: "Desk Organizer",
    category: "Home Office",
    quantity: 0,
    price: 24.99,
    status: "out-of-stock",
  },
  {
    id: "INV009",
    name: "Wireless Charger",
    category: "Electronics",
    quantity: 30,
    price: 39.99,
    status: "in-stock",
  },
  {
    id: "INV010",
    name: "Mechanical Pencils",
    category: "Stationery",
    quantity: 12,
    price: 8.99,
    status: "low-stock",
  },
];
