import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseCategoryProps, ExpenseProps } from "@/types";
import { Input } from "@/components/ui/input";
import { BANK_ACCOUNTS_EMOJI } from "@/helpers/Constants";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { redirect } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import AddExpenseModal from "@/components/modals/AddExpenseModal";

const expenseColumns: ColumnDef<ExpenseProps>[] = [
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
        className="rounded-sm sticky"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="rounded-sm sticky"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="text-left">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="flex flex-row justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(amount);
      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "expenseCategoryDtos",
    header: () => (
      <div className="flex flex-row justify-center">Expense Categories</div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-row gap-1 justify-center">
        {row.original.expenseCategoryDtos.map(
          (category: ExpenseCategoryProps) => (
            <Badge
              key={category.id}
              className="flex flex-row gap-1 items-center"
            >
              <span>{String.fromCodePoint(Number(category.iconName))}</span>
              {category.categoryName}
            </Badge>
          )
        )}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "bankAccountDto.name",
    header: ({ column }) => (
      <div className="flex flex-row justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <span className="mr-2">{BANK_ACCOUNTS_EMOJI}</span>
        {row.original.bankAccountDto.name}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <div className="flex flex-row justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("date")}</div>;
    },
  },
  {
    accessorKey: "annotation",
    header: () => <p>Annotation</p>,
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("annotation") ?? "-"}</div>
    ),
  },
];

interface ExpensesTableProps {
  data: ExpenseProps[];
}

const ExpensesTable: React.FC<ExpensesTableProps> = ({ data }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const deleteExpense = (expenseId: string) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    axios
      .delete(`/api/v1/expenses/${expenseId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.status === 204) {
          toast({
            variant: "success",
            title: "Expense deleted",
            description: "The expense has been deleted successfully.",
          });
        }
      })
      .catch((error) => {
        console.error(error);
        if (error.status === 403) {
          redirect("/auth/sign-up");
        } else if (error.status === 400) {
          toast({
            variant: "destructive",
            title: "Bad request",
            description: error.response.data.errors.join(", "),
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              "Unable to delete the expense. Please try again later.",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: data,
    columns: expenseColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: undefined,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },
  });

  return (
    <div className="w-[95%]">
      <div className="flex items-center justify-between px-1 py-4">
        <Input
          disabled={isLoading}
          placeholder="Search by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex flex-row gap-2">
          {table.getSelectedRowModel().rows.length > 0 && (
            <Button
              disabled={isLoading}
              variant={"secondary"}
              onClick={() => {
                deleteExpense(table.getSelectedRowModel().rows[0].original.id);
              }}
            >
              <Trash2 />
              Delete expense
              {table.getSelectedRowModel().rows.length > 1 ? "s" : ""}
            </Button>
          )}
          <AddExpenseModal
            variant="default"
            isMainButton={false}
            isMainLayoutButton={false}
          />
        </div>
      </div>
      <div
        className="rounded-md border overflow-y-scroll"
        style={{ maxHeight: "65vh" }}
      >
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
                  );
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-nowrap" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={expenseColumns.length} className="h-12 text-center">
                  No results...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-start space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </div>
  );
};

export default ExpensesTable;
