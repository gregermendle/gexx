"use client";

import { type UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type Table as TTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
} from "lucide-react";
import * as React from "react";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export type Column<TData, TValue = any> = ColumnDef<TData, TValue> & {
  isNumeric?: boolean;
};

const TableProvider = React.createContext<TTable<any> | null>(null);

const useTable = () => {
  const ctx = React.useContext(TableProvider);
  if (!ctx) throw new Error("No table found in context");
  return ctx;
};

export function DataTableColumnFilter() {
  const table = useTable();
  const headers = React.useMemo(() => table.getFlatHeaders(), []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <ColumnsIcon />
          <span className="hidden lg:inline">Columns</span>
          <span className="lg:hidden">Columns</span>
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-1 bg-background">
        {headers
          .filter(
            (header) =>
              typeof header.column.accessorFn !== "undefined" &&
              header.column.getCanHide()
          )
          .map((header) => {
            const column = header.column;
            return (
              <Button
                key={column.id}
                variant="ghost"
                size="sm"
                className="group capitalize flex items-center gap-2 w-full justify-start font-normal"
                onClick={(e) =>
                  column.toggleVisibility(
                    !(e.currentTarget.dataset.checked === "true")
                  )
                }
                data-checked={column.getIsVisible()}
                aria-checked={column.getIsVisible()}
              >
                <Check className="group-[[data-checked=false]]:opacity-10" />
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                ) || column.id}
              </Button>
            );
          })}
      </PopoverContent>
    </Popover>
  );
}

export function DataTableHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-2 mb-6">{children}</div>
  );
}

export function DataTable<TData extends { id: string | number }, TValue>({
  data,
  columns,
  children,
}: {
  columns: Array<Column<TData, TValue>>;
  data: TData[];
  children: React.ReactNode;
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const state = {
    sorting,
    columnVisibility,
    rowSelection,
    columnFilters,
    pagination,
  };

  const table = useReactTable({
    data,
    columns,
    state,
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <TableProvider.Provider
      value={React.useMemo(() => ({ ...table }), [state])}
    >
      <div>{children}</div>
    </TableProvider.Provider>
  );
}

export function DataTableContent() {
  const table = useTable();

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => table.getRowModel().rows?.map(({ id }) => id) || [],
    [table]
  );

  return (
    <div className="overflow-hidden rounded-lg border mb-3">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const customColumn = header.column.columnDef as Column<any>;
                const isSortable = header.column.getCanSort();
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={isSortable ? "cursor-pointer select-none" : ""}
                    onClick={
                      isSortable
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          customColumn.isNumeric && "justify-end"
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {isSortable && (
                          <div className="ml-1">
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown className="h-4 w-4" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4 opacity-50" />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="**:data-[slot=table-cell]:first:w-8">
          {table.getRowModel().rows?.length ? (
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </SortableContext>
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function DataTablePagination() {
  const table = useTable();

  return (
    <div className="flex items-center justify-between">
      <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="w-20" id="rows-per-page">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
