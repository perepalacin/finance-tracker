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
import { CalendarIcon, Edit, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { useUserData } from "@/context/UserDataContext";
import { AddButtonsProps, BankAccountProps, ExpenseCategoryProps, ExpenseProps } from "@/types";
import AddBankAccountDialog from "./AddBankAccountModal";
import AddExpenseCategoryModal from "./AddExpenseCategoryModal";
import { MultiSelect } from "../ui/multi-select";
import { EXPENSES_EMOJI, WindowEvents } from "@/helpers/Constants";
import { AdminApi } from "@/helpers/Api";

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

interface AddExpenseButtonProps extends AddButtonsProps {
  expenseToEdit?: ExpenseProps;
  resetExpenseToEdit?: () => void;
}

const AddExpenseModal: React.FC<AddExpenseButtonProps> =({isMainLayoutButton, isMainButton, variant = "ghost", isOpen=false, setIsOpen, renderButton = true, expenseToEdit, resetExpenseToEdit}) => {
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

  useEffect(() => {
    if (expenseToEdit) {
      form.reset({
        name: expenseToEdit.name,
        amount: expenseToEdit.amount,
        annotation: expenseToEdit.annotation ? expenseToEdit.annotation : undefined,
        expenseDate: parse(expenseToEdit.date, 'dd-MM-yyyy', new Date()),
        bankAccountId: expenseToEdit.bankAccountDto.id,
        expenseCategories: expenseToEdit.expenseCategoryDtos.map((category: ExpenseCategoryProps) => category.id),
      });
    } else {
      form.reset({
        name: undefined,
        amount: undefined,
        annotation: undefined,
        expenseDate: undefined,
        bankAccountId: undefined,
        expenseCategories: undefined,
      });
    }
  }, [expenseToEdit, form]);

  const onSubmit = (data: AddExpenseFormValues) => {
    setIsLoading(true);
    const api = new AdminApi();

    const body = {
      name: data.name,
      amount: data.amount,
      annotation: data.annotation,
      date: format(data.expenseDate, 'dd-MM-yyyy'),
      bankAccountId: data.bankAccountId,
      expenseCategoryIds: data.expenseCategories
    };

    const handleSuccessApiCall = (data: ExpenseProps) => {
      setOpen(false);
      let eventType = "";
      if (setIsOpen) {
        setIsOpen(false);
      }
      if (expenseToEdit) {
        eventType = WindowEvents.EDIT_EXPENSE;
      } else {
        eventType = WindowEvents.ADD_EXPENSE;
      }

      const event = new CustomEvent(eventType, { detail: { data: data } });
      window.dispatchEvent(event);

      form.reset();
      setExpenseCategoryToEdit(undefined);
    }

    const handleFinishApiCall = () => {
      setIsLoading(false);
      if (resetExpenseToEdit) {
        resetExpenseToEdit();
      }
    }

    if (expenseToEdit) {
      api.sendRequest("PUT", "/api/v1/expenses/" + expenseToEdit.id, { body: body, showToast: true, successToastMessage: data.name + " has been updated!", successToastTitle: "Success", onSuccessFunction: (data) => handleSuccessApiCall(data), onFinishFunction: handleFinishApiCall})
    } else {
    api.sendRequest("POST", "/api/v1/expenses", { body: body, showToast: true, successToastMessage: data.name + " has been created!", successToastTitle: "Success", onSuccessFunction: (data) => handleSuccessApiCall(data), onFinishFunction: handleFinishApiCall})
    }
  };
  
  const deleteExpenseCategory = (categoryId: string) => {
    setIsLoading(true);
    const api = new AdminApi();
    api.sendRequest("DELETE", "/api/v1/categories" + categoryId, {showToast: true, successToastTitle: "Success", successToastMessage: "Expense category deleted succesfully", onSuccessFunction: () => setExpenseCategories([...expenseCategories].filter((category) => category.id === categoryId))});
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (setIsOpen) {setIsOpen(open); }}}>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                { renderButton && (isMainButton ?
                  <Button variant={"secondary"} className={`absolute bottom-6 right-6 rounded-full h-14 w-14 text-2xl button-transition ${isMainLayoutButton ? 'animate-nested-add-button-1' : 'transition-transform'}`}>
                    {EXPENSES_EMOJI}
                  </Button>
                :
                  expenseToEdit ? 
                  <Button variant={variant} className="flex flex-row justify-start items-center gap-1 w-full">
                    <Edit width={15} height={15} />
                    <p>Edit Expense</p>
                  </Button>
                :
                  <Button variant={variant} className="flex flex-row justify-start items-center gap-1 w-full">
                    <Plus width={15} height={15} />
                    <p>Add an Expense</p>
                  </Button>
                )}
            </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent className="px-2 py-1 rounded-md mb-2">
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
                    defaultValue={field.value ? field.value : []}
                    options={expenseCategories.map((item) => ({label: item.categoryName, value: item.id, emoji: item.iconName}))}
                    onValueChange={field.onChange}
                    placeholder="Select a set of expense categories"
                    variant={"secondary"}
                    animation={2}
                    onDelete={deleteExpenseCategory}
                    onEdit={(optionId) =>{setExpenseCategoryToEdit(expenseCategories.find((item: ExpenseCategoryProps) => item.id === optionId)); setIsExpenseCategoryModalOpen(true)}}
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
                      defaultValue={field.value ? [field.value] : []}
                      options={bankAccounts.map((item) => ({label: item.name, value: item.id, emoji: '0x1FAAA'}))}
                      onValueChange={(data) => field.onChange(data[0])}
                      placeholder="Select a bank account"
                      variant={"secondary"}
                      animation={2}
                      isMulti={false}
                      onEdit={(optionId) => {setBankAccountToEdit(bankAccounts.find((item) => item.id === optionId)); setIsBankAccountsModalOpen(true)}}
                      onDelete={(optionId) => {deleteExpenseCategory(optionId)}}
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
                {isLoading ? expenseToEdit ? "Updating..." : "Creating..." : expenseToEdit ? "Update Expense" : "Add Expense"}
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
