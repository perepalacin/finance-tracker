import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"

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
import { CalendarIcon, ChartNoAxesCombined, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { redirect } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useUserData } from "@/context/UserDataContext";
import { AddButtonsProps, BankAccountProps, ExpenseCategoryProps } from "@/types";
import AddBankAccountDialog from "./AddBankAccountModal";
import AddExpenseCategoryModal from "./AddExpenseCategoryModal";
import { MultiSelect } from "../ui/multi-select";

const AddExpenseSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(30, { message: "Name must be at most 30 characters long." }),
    amount: z.coerce
        .number()
        .nonnegative({ message: "Expense amount must be a positive number." }),
    annotation: z
        .string()
        .optional(),
    expenseDate: z.date({required_error: "Start date is required.",}),
    expenseCategories: z.array(z.string()),    
    bankAccountId: z.string().uuid({message: "Please assign this expense to a Bank Account"})
  });

type AddExpenseFormValues = z.infer<typeof AddExpenseSchema>;

const AddExpenseModal: React.FC<AddButtonsProps> =({isMainLayoutButton, isMainButton, variant = "ghost", isOpen=false, setIsOpen, renderButton = true}) => {
  const [open, setOpen] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [isBankAccountsModalOpen, setIsBankAccountsModalOpen] = useState(false);
  const [isExpenseCategoryModalOpen, setIsExpenseCategoryModalOpen] = useState(false);
  const [expenseCategoryToEdit, setExpenseCategoryToEdit] = useState<ExpenseCategoryProps>();
  const [bankAccountToEdit, setBankAccountToEdit] = useState<BankAccountProps>();
 
  const { expenseCategories, setExpenseCategories, bankAccounts } = useUserData();

  const form = useForm<AddExpenseFormValues>({
    resolver: zodResolver(AddExpenseSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: AddExpenseFormValues) => {
    setIsLoading(true);

    const token = localStorage.getItem('token');

    const formattedDate = format(data.expenseDate, 'dd-MM-yyyy');
    axios.post(
      "/api/v1/expenses",
      {
        name: data.name,
        amount: data.amount,
        annotation: data.annotation,
        date: formattedDate,
        bankAccountId: data.bankAccountId,
        expenseCategoryIds: data.expenseCategories
      },
      {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          toast({
            variant: "success",
            title: "Expense created!",
            description: data.name + " has been added successfully.",
          });
          setOpen(false);
          if (setIsOpen) {
            setIsOpen(false);
          }
          form.reset();
        }
      })
      .catch((error) => {
        console.log(error);
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
            description: "Unable to create expense. Please try again later.",
          })
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  const deleteExpenseCategory = (categoryId: string) => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    axios.delete(
      `/api/v1/categories/${categoryId}`,
      {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.status === 204) {
          toast({
            variant: "success",
            title: "Category deleted!",
            description: "The expense category has been added successfully.",
          });
          const newExpenseCategories = [...expenseCategories];
          newExpenseCategories.filter((category: ExpenseCategoryProps) => category.id !== categoryId);
          setExpenseCategories(newExpenseCategories);
        }
      })
      .catch((error) => {
        console.log(error);
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
            description: "Unable to create expense. Please try again later.",
          })
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }


  return (
    <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (setIsOpen) {setIsOpen(open); }}}>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                { renderButton && (isMainButton ?
                  <Button variant={"secondary"} className={`absolute bottom-6 right-6 rounded-full h-14 w-14 text-2xl button-transition ${isMainLayoutButton ? 'animate-nested-add-button-1' : 'transition-transform'}`}>
                    {String.fromCodePoint(0x1F4B8)}
                  </Button>
                :
                  <Button variant={variant} className="flex flex-row justify-start items-center gap-1 w-full">
                    <ChartNoAxesCombined width={15} height={15} />
                    <p>Add an Expense</p>
                  </Button>
                )}
            </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent className="bg-card px-2 py-1 rounded-md mb-2">
                <p>Add an Expense</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        <DialogContent className="w-1/2">
          <DialogHeader>
          <DialogTitle className="w-full">Add a new Expense</DialogTitle>
          <DialogDescription>
            Add a new expense to one of your bank accounts
          </DialogDescription>
        </DialogHeader>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full p-r-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Expense name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="annotation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annotation</FormLabel>
                  <FormControl>
                    <Input placeholder="Christmas Gift" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount*</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
                  control={form.control}
                  name="expenseDate"
                  render={({ field }) => (
                      <FormItem className="flex flex-col">
                      <FormLabel>Date*</FormLabel>
                      <Popover>
                          <PopoverTrigger asChild>
                          <FormControl>
                              <Button
                              variant={"outline"}
                              className={cn(
                                  "pl-3 text-left font-normal truncate",
                                  !field.value && "text-muted-foreground"
                              )}
                              >
                              {field.value ? (
                                  format(field.value, "PPP")
                              ) : (
                                  <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                          </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                          />
                          </PopoverContent>
                      </Popover>
                      <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
              control={form.control}
              name="expenseCategories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense categories</FormLabel>
                  <MultiSelect
                    options={expenseCategories.map((item) => ({label: item.categoryName, value: item.id, emoji: item.iconName}))}
                    onValueChange={field.onChange}
                    placeholder="Select a set of expense categories"
                    variant={"secondary"}
                    animation={2}
                    onDelete={deleteExpenseCategory}
                    onEdit={(optionId) =>{console.log(optionId); setExpenseCategoryToEdit(expenseCategories.find((item: ExpenseCategoryProps) => item.id === optionId)); setIsExpenseCategoryModalOpen(true)}}
                  >
                    <Button variant={"ghost"} className="w-full flex flex-row" onClick={() => setIsExpenseCategoryModalOpen(true)}>
                      <Plus />
                      <p>Add a new expense category</p>
                    </Button>
                  </MultiSelect>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Account*</FormLabel>
                  <MultiSelect
                      options={bankAccounts.map((item) => ({label: item.name, value: item.id, emoji: '0x1FAAA'}))}
                      onValueChange={(data) => field.onChange(data[0])}
                      placeholder="Select a bank account"
                      variant={"secondary"}
                      animation={2}
                      isMulti={false}
                      onEdit={(optionId) => {setBankAccountToEdit(bankAccounts.find((item) => item.id === optionId)); setIsBankAccountsModalOpen(true)}}
                      onDelete={() => {}}
                    >
                      <Button variant={"ghost"} className="w-full flex flex-row" onClick={() => setIsBankAccountsModalOpen(true)}>
                        <Plus />
                        <p>Add a new bank account</p>
                      </Button>
                    </MultiSelect>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Add Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        { isBankAccountsModalOpen &&
          <AddBankAccountDialog isMainLayoutButton={false} isMainButton={false} isOpen={isBankAccountsModalOpen} setIsOpen={(isOpen) => setIsBankAccountsModalOpen(isOpen)} renderButton={false} bankAccountToEdit={bankAccountToEdit} resetBankAccountToEdit={() => {setBankAccountToEdit(undefined); setIsBankAccountsModalOpen(false)}} />
        }
        {isExpenseCategoryModalOpen &&
          <AddExpenseCategoryModal isMainLayoutButton={false} isMainButton={false} isOpen={isExpenseCategoryModalOpen} setIsOpen={(isOpen) => setIsExpenseCategoryModalOpen(isOpen)} renderButton={false} expenseCategoryToEdit={expenseCategoryToEdit} resetExpenseCategoryToEdit={() => {setExpenseCategoryToEdit(undefined); setIsExpenseCategoryModalOpen(false)}}/>
        }
      </DialogContent>
    </Dialog>
  )
}

export default AddExpenseModal;
