import * as React from "react"
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
} from "@tanstack/react-table"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IncomeProps } from "@/types"
import { BANK_ACCOUNTS_EMOJI } from "@/helpers/Constants"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import { redirect } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import AddIncomeModal from "@/components/modals/AddIncomeModal"

const incomeColumns: ColumnDef<IncomeProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
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
    header: () => (
      <p className="text-center">Name</p>
    ),
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => (
      <p className="text-center">Amount</p>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(amount);
      return (
        <div className="text-center font-medium">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "incomeSourceDto",
    header: () => (
      <p className="text-center">Income source</p>
    ),
    cell: ({ row }) => (
      <div className="flex flex-row gap-1 justify-center">
        <Badge color={row.original.incomeSourceDto.color}>
            {row.original.incomeSourceDto.name}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "bankAccountDto.name",
    header: () => (
      <p className="text-center">Account</p>
    ),
    cell: ({ row }) => (
      <p className="text-center">
        <span className="mr-2">{BANK_ACCOUNTS_EMOJI}</span>
        {row.original.bankAccountDto.name}
      </p>
    ),
  },
  {
    accessorKey: "date",
    header: () => (
      <p className="text-center">Date</p>
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("date")}</div>;
    },
  },
  {
    accessorKey: "annotation",
    header: () => (
      <p>
        Annotation
      </p>
    ),
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("annotation") ?? "-"}</div>
    ),
  },
];

interface IncomeTableProps {
  data: IncomeProps[];
  hasNextPage: boolean;
  requestNextPage: () => void;
}

const IncomesTable:React.FC<IncomeTableProps> = ({data, requestNextPage, hasNextPage}) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const deleteIncome = (incomeId: string) => {

    setIsLoading(true);
    const token = localStorage.getItem('token');

    axios.delete(
      `/api/v1/incomes/${incomeId}`,
      {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.status === 204) {
          toast({
            variant: "success",
            title: "Income deleted",
            description: "The income has been deleted successfully.",
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
            description: error.response.data.errors.join(', '),
          })
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Unable to delete the income. Please try again later.",
          })
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: data,
    columns: incomeColumns,
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
      }
    },
  });

  return (
    <div className="w-[95%]">
      <div className="flex items-center justify-between px-1 py-4">
        <div className="flex flex-row gap-2">
          {table.getSelectedRowModel().rows.length > 0 &&
          <Button disabled = {isLoading} variant={"secondary"} onClick={() => {deleteIncome(table.getSelectedRowModel().rows[0].original.id)}}>
            <Trash2 />
            Delete income{table.getSelectedRowModel().rows.length > 1 ? "s" : ""}
          </Button>
          }
          <AddIncomeModal variant="default" isMainButton={false} isMainLayoutButton={false} />
        </div>
      </div>
      <div className="rounded-md border overflow-y-scroll" style={{maxHeight: '65vh'}}>
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
              <>
              {table.getRowModel().rows.map((row) => (
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
              ))}
              {hasNextPage &&
              <TableRow>
                <TableCell colSpan={incomeColumns.length} className="text-center p-0">
                  <Button variant="ghost" className="w-full" onClick={requestNextPage}>
                    Load more rows
                  </Button>
                </TableCell>
              </TableRow>
              }
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={incomeColumns.length}
                  className="h-12 text-center"
                >
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
  )
}

export default IncomesTable;