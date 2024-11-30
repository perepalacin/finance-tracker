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
import { useUserData } from "@/context/UserDataContext"
import { TransferProps } from "@/types"
import AddTransferModal from "@/components/modals/AddTransferModal"
import { BANK_ACCOUNTS_EMOJI, WindowEvents } from "@/helpers/Constants"
import { AdminApi } from "@/helpers/Api"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

const transferColumns: ColumnDef<TransferProps>[] = [
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
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="flex flex-row justify-center">
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
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
      return (
        <div className="text-center font-medium">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "sendingBankAccountDto.name",
    header: ({ column }) => (
      <div className="flex flex-row justify-center">
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          >
          From Account
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <span className="mr-2">{BANK_ACCOUNTS_EMOJI}</span>
        {row.original.sendingBankAccountDto.name}
      </div>
    ),
  },
  {
    accessorKey: "receivingBankAccountDto.name",
    header: ({ column }) => (
      <div className="flex flex-row justify-center">
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          >
          To Account
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <span className="mr-2">{BANK_ACCOUNTS_EMOJI}</span>
        {row.original.receivingBankAccountDto.name}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <div className="flex flex-row justify-center">
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
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

interface TransferTableProps {
  data: TransferProps[];
  hasNextPage: boolean;
  requestNextPage: () => void;
}

const TransferTable:React.FC<TransferTableProps> = ({data, requestNextPage, hasNextPage}) => {
  const {bankAccounts} = useUserData();
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const deleteTransfer = () => {
    setIsLoading(true);
    const api = new AdminApi();
    if (table.getSelectedRowModel().rows.length === 1) {
      const transferId = table.getSelectedRowModel().rows[0].original.id;
      const handleSuccessApiCall = () => {
        table.resetRowSelection();
        const event = new CustomEvent(WindowEvents.DELETE_TANSFER, { detail: { data: transferId } });
        window.dispatchEvent(event);
      }
      const handleFinishApiCall = () => {
        setIsLoading(false);
      }
      api.sendRequest("DELETE", "/api/v1/transfers/" + transferId, { showToast: true, successToastMessage: "Transfer has been deleted succesfully!", successToastTitle: "Deleted", onSuccessFunction: () => handleSuccessApiCall(), onFinishFunction: handleFinishApiCall})
    } else {
      const body = table.getSelectedRowModel().rows.map((transfer) => transfer.original.id);
      const handleSuccessApiCall = () => {
        table.resetRowSelection();
        const event = new CustomEvent(WindowEvents.DELETE_TANSFER, { detail: { data: [] } });
        window.dispatchEvent(event);
      }
      const handleFinishApiCall = () => {
        setIsLoading(false);
      }
      api.sendRequest("POST", "/api/v1/transfers/delete-batch", {body: body, showToast: true, successToastMessage: "All selected transfers have been deleted succesfully!", successToastTitle: "Deleted", onSuccessFunction: () => handleSuccessApiCall(), onFinishFunction: handleFinishApiCall})
    }
  }

  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: data,
    columns: transferColumns,
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
        pageSize: bankAccounts.length,
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
                <AlertDialogAction onClick={deleteTransfer}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          }
          <AddTransferModal variant="default" isMainButton={false} isMainLayoutButton={false} resetTransferToEdit={() => table.resetRowSelection()} transferToEdit={table.getSelectedRowModel().rows.length === 1 ? table.getSelectedRowModel().rows[0].original : undefined}/>
        </div>
      </div>
      <div className="rounded-md border overflow-y-scroll" style={{maxHeight: '65vh'}}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="border-r border-muted font-medium" key={header.id}>
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
                <TableCell colSpan={transferColumns.length} className="text-center p-0">
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
                  colSpan={transferColumns.length}
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

export default TransferTable;