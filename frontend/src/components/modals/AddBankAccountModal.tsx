import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Edit, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useUserData } from "@/context/UserDataContext";
import { AddButtonsProps, BankAccountProps } from "@/types";
import { BANK_ACCOUNTS_EMOJI } from "@/helpers/Constants";

const AddBankAccountSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(30, { message: "Name must be at most 30 characters long." }),
  initialAmount: z.coerce
    .number()
    .nonnegative({ message: "Initial amount must be zero or positive." })
    .optional(),
});

type AddBankAccountFormValues = z.infer<typeof AddBankAccountSchema>;

interface AddBankAccountModalProps extends AddButtonsProps {
  bankAccountToEdit?: BankAccountProps;
  resetBankAccountToEdit?: () => void;
}

const AddBankAccountModal: React.FC<AddBankAccountModalProps> =({isMainLayoutButton, isMainButton, variant="ghost", isOpen = false, setIsOpen, renderButton =true, bankAccountToEdit, resetBankAccountToEdit}) => {
  const [open, setOpen] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);

  const { bankAccounts, setBankAccounts } = useUserData();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen])

  const form = useForm<AddBankAccountFormValues>({
    resolver: zodResolver(AddBankAccountSchema),
    defaultValues: bankAccountToEdit ?
     {
      name: bankAccountToEdit.name,
      initialAmount: bankAccountToEdit.initialAmount
     } :{
      name: "",
    },
  });

  useEffect(() => {
    if (bankAccountToEdit) {
      form.reset({
        name: bankAccountToEdit.name,
        initialAmount: bankAccountToEdit.initialAmount,
      });
    } else {
      form.reset({
        name: "",
        initialAmount: undefined,
      });
    }
  }, [bankAccountToEdit, form]);

  const onSubmit = (data: AddBankAccountFormValues) => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    const url = bankAccountToEdit ? `/api/v1/accounts/${bankAccountToEdit.id}` : "/api/v1/accounts";
    const method = bankAccountToEdit ? axios.put : axios.post;

    method(url, {
      name: data.name,
      initialAmount: data.initialAmount,
    }, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        const successMessage = bankAccountToEdit ? "Bank account updated!" : "Bank account created!";
        toast({
          variant: "success",
          title: successMessage,
          description: data.name + " has been added successfully.",
        });
        if (response.status === 201) {
          const newBankAccounts = [...bankAccounts];
          newBankAccounts.push(response.data);
          setBankAccounts(newBankAccounts);
        } else if (response.status === 200 && bankAccountToEdit) {
          const updatedBankAccounts = bankAccounts.map((account: BankAccountProps) => {
            if (account.id === bankAccountToEdit.id) {
              return response.data; 
            } else {
              return account; 
            }
          });
          setBankAccounts(updatedBankAccounts);
        }
      }
      setOpen(false);
      form.reset();
    })
    .catch((error) => {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to process your request. Please try again later.",
      });
    })
    .finally(() => {
      setIsLoading(false);
      if (resetBankAccountToEdit) {
        resetBankAccountToEdit();
      }
    });
  };

  
  return (
    <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (setIsOpen) {setIsOpen(open); if (resetBankAccountToEdit) {resetBankAccountToEdit()} }}} >
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                {renderButton &&
                ( isMainButton ?
                  <Button variant={"secondary"} className={`absolute bottom-6 right-6 rounded-full h-14 w-14 text-2xl button-transition ${isMainLayoutButton ? 'animate-nested-add-button-5' : 'transition-transform'}`}>
                    {BANK_ACCOUNTS_EMOJI}
                  </Button>
                :
                  <Button variant={variant} className="flex flex-row items-center gap-1 w-full">
                    {bankAccountToEdit ?
                      <>
                        <Edit width={15} height={15} />
                        <p>Edit bank account</p> 
                      </>
                    :
                    <>
                      <Plus width={15} height={15} />
                      <p>Add bank account</p> 
                    </>
                    }
                  </Button>
                )
              }
            </DialogTrigger>
              </TooltipTrigger>
              { isMainLayoutButton &&
              <TooltipContent className="px-2 py-1 rounded-md mb-2">
                <p>Add a Bank Account</p>
              </TooltipContent>
              }
            </Tooltip>
          </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{bankAccountToEdit ? "Update Bank Account" : "Add a new Bank Account"}</DialogTitle>
          <DialogDescription>
            { bankAccountToEdit ? 
            "" : "Create a new bank account to be able to associate expenses, incomes and investments to it."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="My Bank Account" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="initialAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Amount*</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? bankAccountToEdit ? "Updating" : "Creating..." : bankAccountToEdit ? "Update account" : "Create account"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddBankAccountModal;
