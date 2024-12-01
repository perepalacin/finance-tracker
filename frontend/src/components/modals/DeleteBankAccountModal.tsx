import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { AdminApi } from "@/helpers/Api";
import { BankAccountProps } from "@/types";
import { Row } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
  
interface DeleteBankAccountModalProps {
    rowsSelected: Row<BankAccountProps>[];
} 

const DeleteBankAccountModal:React.FC<DeleteBankAccountModalProps> = ({rowsSelected}) => {

    const handleDeleteBankAccount = () => {
        const api = new AdminApi();
        if (rowsSelected.length === 1) {
            api.sendRequest(("DELETE"), `/api/v1/accounts/${rowsSelected[0].original.id}`);
        }
    }


    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant={"secondary"}>
                <Trash2 />
                Delete account{rowsSelected.length > 1 ? "s" : ""}
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                All the investments, expenses and incomes associated with this account will be deleted as well.
              This action cannot be undone. Please proceed with caution.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBankAccount}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  
  export default DeleteBankAccountModal