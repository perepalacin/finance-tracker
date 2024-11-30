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
import { ArrowUpDown, Trash2 } from "lucide-react"

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
import { InvestmentCategoryProps, InvestmentProps } from "@/types"
import { BANK_ACCOUNTS_EMOJI, WindowEvents } from "@/helpers/Constants"
import AddInvestmentModal from "@/components/modals/AddInvestmentModal"
import { Badge } from "@/components/ui/badge"
import { AdminApi } from "@/helpers/Api"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

const investmentColumns: ColumnDef<InvestmentProps>[] = [
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Name
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "amountInvested",
    header: ({ column }) => (
      <div className="flex flex-row justify-center">
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          >
          Amount Invested
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountInvested"));
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
    accessorKey: "investmentCategoryDtos",
    header: () => (
      <div className="flex flex-row justify-center">
          Investment Categories
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-row gap-1 justify-center">
        {row.original.investmentCategoryDtos.map((category: InvestmentCategoryProps) => 
            <Badge key={category.id} color={category.color}>
                {category.investmentCategoryName}
            </Badge>
        )}
      </div>
    ),
    enableSorting: false
  },
  {
    accessorKey: "bankAccountDto.name",
    header: ({ column }) => (
      <div className="flex flex-row justify-center">
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
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
    accessorKey: "startDate",
    header: ({ column }) => (
      <div className="flex flex-row justify-center">
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          >
          Start date
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("startDate")}</div>;
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <div className="flex flex-row justify-center">
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          >
          End date
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("endDate")}</div>;
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

interface InvestmentTableProps {
  data: InvestmentProps[];
  hasNextPage: boolean;
  requestNextPage: () => void;
}

const InvestmentsTable:React.FC<InvestmentTableProps> = ({data, hasNextPage, requestNextPage}) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const deleteInvestment = () => {
    setIsLoading(true);
    const api = new AdminApi();
    if (table.getSelectedRowModel().rows.length === 1) {
      const investmentId = table.getSelectedRowModel().rows[0].original.id;
      const handleSuccessApiCall = () => {
        table.resetRowSelection();
        const event = new CustomEvent(WindowEvents.DELETE_INVESTMENT, { detail: { data: investmentId } });
        window.dispatchEvent(event);
      }
      const handleFinishApiCall = () => {
        setIsLoading(false);
      }
      api.sendRequest("DELETE", "/api/v1/investments/" + investmentId, { showToast: true, successToastMessage: "Investment has been deleted succesfully!", successToastTitle: "Deleted", onSuccessFunction: () => handleSuccessApiCall(), onFinishFunction: handleFinishApiCall})
    } else {
      const body = table.getSelectedRowModel().rows.map((investment) => investment.original.id);
      const handleSuccessApiCall = () => {
        table.resetRowSelection();
        const event = new CustomEvent(WindowEvents.DELETE_INVESTMENT, { detail: { data: [] } });
        window.dispatchEvent(event);
      }
      const handleFinishApiCall = () => {
        setIsLoading(false);
      }
      api.sendRequest("POST", "/api/v1/investments/delete-batch", {body: body, showToast: true, successToastMessage: "All selected investments have been deleted succesfully!", successToastTitle: "Deleted", onSuccessFunction: () => handleSuccessApiCall(), onFinishFunction: handleFinishApiCall})
    }
  }

  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: data,
    columns: investmentColumns,
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isLoading}
                  variant={"secondary"}
                >
                  <Trash2 />
                  Delete income
                  {table.getSelectedRowModel().rows.length > 1 ? "s" : ""}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Please proceed with caution.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteInvestment}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          }
          <AddInvestmentModal variant="default" isMainButton={false} isMainLayoutButton={false} 
          resetInvestmentToEdit={() => table.resetRowSelection()} investmentToEdit={table.getSelectedRowModel().rows.length === 1 ? table.getSelectedRowModel().rows[0].original : undefined}
          />
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
                <TableCell colSpan={investmentColumns.length} className="text-center p-0">
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
                  colSpan={investmentColumns.length}
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

export default InvestmentsTable;