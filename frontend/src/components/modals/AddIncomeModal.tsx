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
import { AddButtonsProps, BankAccountProps, IncomeSourceProps } from "@/types";
import AddBankAccountDialog from "./AddBankAccountModal";
import AddIncomeSourceModal from "./AddIncomeSourceModal";
import { MultiSelect } from "../ui/multi-select";
import { INCOMES_EMOJI } from "@/helpers/Constants";


const AddIncomeSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(30, { message: "Name must be at most 30 characters long." }),
    amount: z.coerce
        .number()
        .nonnegative({ message: "Income amount must be a positive number." }),
    annotation: z
        .string()
        .optional(),
    incomeDate: z.date({required_error: "Start date is required.",}),
    incomeSourceId: z.string().uuid({message: "Please assign an income source to this income"}),
    bankAccountId: z.string().uuid({message: "Please assign this investment a Bank Account"})
  });

type AddIncomeFormValues = z.infer<typeof AddIncomeSchema>;

const AddIncomeModal: React.FC<AddButtonsProps> =({isMainLayoutButton, isMainButton, variant = "ghost", isOpen=false, setIsOpen, renderButton = true}) => {
  const [open, setOpen] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [isBankAccountsModalOpen, setIsBankAccountsModalOpen] = useState(false);
  const [isIncomeSourceModalOpen, setIsIncomeSourceModalOpen] = useState(false);
  const [incomeSourceToEdit, setIncomeSourceToEdit] = useState<IncomeSourceProps>();
  const [bankAccountToEdit, setBankAccountToEdit] = useState<BankAccountProps>();

  const { incomeSources, bankAccounts } = useUserData();

  const form = useForm<AddIncomeFormValues>({
    resolver: zodResolver(AddIncomeSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: AddIncomeFormValues) => {
    setIsLoading(true);

    const token = localStorage.getItem('token');

    const formattedDate = format(data.incomeDate, 'dd-MM-yyyy');
    axios.post(
      "/api/v1/incomes",
      {
        name: data.name,
        amount: data.amount,
        annotation: data.annotation,
        date: formattedDate,
        bankAccountId: data.bankAccountId,
        incomeSourceId: data.incomeSourceId
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
            title: "Investment created!",
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
            description: "Unable to create investment. Please try again later.",
          })
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (setIsOpen) {setIsOpen(open); }}}>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                { renderButton && (isMainButton ?
                  <Button variant={"secondary"} className={`absolute bottom-6 right-6 rounded-full h-14 w-14 text-2xl button-transition ${isMainLayoutButton ? 'animate-nested-add-button-2' : 'transition-transform'}`}>
                    {INCOMES_EMOJI}
                  </Button>
                :
                  <Button variant={variant} className="flex flex-row justify-start items-center gap-1 w-full">
                    <ChartNoAxesCombined width={15} height={15} />
                    <p>Add an Income</p>
                  </Button>
                )}
            </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent className="px-2 py-1 rounded-md mb-2">
                <p>Add an Income</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        <DialogContent className="w-1/2">
          <DialogHeader>
          <DialogTitle className="w-full"> Add a new Income</DialogTitle>
          <DialogDescription>
            Add a new income to one of your bank accounts
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
                    <Input placeholder="Income name" {...field} />
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
                    <Input placeholder="June Salary" {...field} />
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
                  name="incomeDate"
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
              name="incomeSourceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income Source*</FormLabel>
                    <MultiSelect
                      options={incomeSources.map((item) => ({label: item.name, value: item.id, color: item.color}))}
                      onValueChange={(data) => field.onChange(data[0])}
                      placeholder="Select an income source"
                      variant={"secondary"}
                      animation={2}
                      renderBadge={true}
                      isMulti={false}
                      onEdit={(optionId) => {setIncomeSourceToEdit(incomeSources.find((item) => item.id === optionId)); setIsIncomeSourceModalOpen(true)}}
                      onDelete={() => {}}
                    >
                      <Button variant={"ghost"} className="w-full flex flex-row" onClick={() => setIsIncomeSourceModalOpen(true)}>
                        <Plus />
                        <p>Add a new income source</p>
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
                {isLoading ? "Creating..." : "Add Income"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        {isBankAccountsModalOpen &&
        <AddBankAccountDialog isMainLayoutButton={false} isMainButton={false} isOpen={isBankAccountsModalOpen} setIsOpen={(isOpen) => setIsBankAccountsModalOpen(isOpen)} renderButton={false} bankAccountToEdit={bankAccountToEdit} resetBankAccountToEdit={() => {setBankAccountToEdit(undefined); setIsBankAccountsModalOpen(false) }}/>
        }
        {isIncomeSourceModalOpen &&
        <AddIncomeSourceModal isMainLayoutButton={false} isMainButton={false} isOpen={isIncomeSourceModalOpen} setIsOpen={(isOpen) => setIsIncomeSourceModalOpen(isOpen)} renderButton={false} incomeSourceToEdit = {incomeSourceToEdit} resetIncomeSourceToEdit={() => {setIncomeSourceToEdit(undefined); setIsIncomeSourceModalOpen(false)}} />
        }
      </DialogContent>
    </Dialog>
  )
}

export default AddIncomeModal;
