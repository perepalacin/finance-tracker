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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { MultiSelect } from "../ui/multi-select";
import { useUserData } from "@/context/UserDataContext";
import { AddButtonsProps, BankAccountProps, InvestmentCategoryProps, InvestmentProps } from "@/types";
import AddBankAccountDialog from "./AddBankAccountModal";
import AddInvestmentCategoryModal from "./AddInvestmentCategoryModal";
import { INVESTMENTS_EMOJI, WindowEvents } from "@/helpers/Constants";
import { AdminApi } from "@/helpers/Api";


const AddInvestmentSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(30, { message: "Name must be at most 30 characters long." }),
    amountInvested: z.coerce
        .number()
        .nonnegative({ message: "Initial amount must be positive." }),
    annotation: z
        .string()
        .optional(),
    startDate: z.date({required_error: "Start date is required.",}),
    endDate: z.date({required_error: "End date is required.",}),
    investmentCategoriesId: z
      .array(z.string()),
    bankAccountId: z.string().uuid({message: "Please assign this investment a Bank Account"})
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date.",
  path: ["endDate"],
});

type AddInvestmentFormValues = z.infer<typeof AddInvestmentSchema>;

interface AddInvestmentModalProps extends AddButtonsProps {
  investmentToEdit?: InvestmentProps;
  resetInvestmentToEdit?: () => void;
}

const AddInvestmentModal: React.FC<AddInvestmentModalProps> =({isMainLayoutButton, isMainButton, variant = "ghost", isOpen=false, setIsOpen, renderButton = true, investmentToEdit, resetInvestmentToEdit}) => {
  const [open, setOpen] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvestmentCategoryModalOpen, setIsInvestmentCategoryModalOpen] = useState(false);
  const [isBankAccountsModalOpen, setIsBankAccountsModalOpen] = useState(false);
  const [bankAccountToEdit, setBankAccountToEdit] = useState<BankAccountProps>();
  const [investmentCategoryToEdit, setInvestmentCategoryToEdit] = useState<InvestmentCategoryProps>();

  const { investmentCategories, bankAccounts } = useUserData();
  // const IdCardIcon = () => <IdCard />;

  const form = useForm<AddInvestmentFormValues>({
    resolver: zodResolver(AddInvestmentSchema),
    defaultValues: {
      name: "",
    },
  });


  useEffect(() => {
    if (investmentToEdit) {
      form.reset({
        name: investmentToEdit.name,
        amountInvested: investmentToEdit.amountInvested,
        annotation: investmentToEdit.annotation ? investmentToEdit.annotation : undefined,
        startDate: parse(investmentToEdit.startDate, 'dd-MM-yyyy', new Date()),
        endDate: parse(investmentToEdit.endDate, 'dd-MM-yyyy', new Date()),
        bankAccountId: investmentToEdit.bankAccountDto.id,
        investmentCategoriesId: investmentToEdit.investmentCategoryDtos.map((category) => category.id)
      });
    } else {
      form.reset({
        name: undefined,
        amountInvested: undefined,
        annotation: undefined,
        startDate: undefined,
        endDate: undefined,
        bankAccountId: undefined,
        investmentCategoriesId: undefined
      });
    }
  }, [investmentToEdit, form]);

  const onSubmit = (data: AddInvestmentFormValues) => {
    setIsLoading(true);
    const api = new AdminApi();
    const body = {
      name: data.name,
      amountInvested: data.amountInvested,
      annotation: data.annotation,
      startDate: format(data.startDate, 'dd-MM-yyyy'),
      endDate: format(data.endDate, 'dd-MM-yyyy'),
      bankAccountId: data.bankAccountId,
      investmentCategoriesId: data.investmentCategoriesId
    };

    const handleSuccessApiCall = (data: InvestmentProps) => {
      setOpen(false);
      if (setIsOpen) {
        setIsOpen(false);
      }
      form.reset();
      setInvestmentCategoryToEdit(undefined);
      let eventType = "";
      if (investmentToEdit) {
        eventType = WindowEvents.EDIT_INVESTMENT;
      } else {
        eventType = WindowEvents.ADD_INVESTMENT;
      }
      if (resetInvestmentToEdit) {
        resetInvestmentToEdit();
      }
      const event = new CustomEvent(eventType, { detail: { data: data } });
      window.dispatchEvent(event);
    }

    const handleFinishApiCall = () => {
      setIsLoading(false);
    }

    if (investmentToEdit) {
      api.sendRequest("PUT", "/api/v1/investments/" + investmentToEdit.id, { body: body, showToast: true, successToastMessage: data.name + " has been updated!", successToastTitle: "Success", onSuccessFunction: (data) => handleSuccessApiCall(data), onFinishFunction: handleFinishApiCall})
    } else {
    api.sendRequest("POST", "/api/v1/investments", { body: body, showToast: true, successToastMessage: data.name + " has been created!", successToastTitle: "Success", onSuccessFunction: (data) => handleSuccessApiCall(data), onFinishFunction: handleFinishApiCall})
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (setIsOpen) {setIsOpen(open); }}}>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                { renderButton && (isMainButton ?
                  <Button variant={"secondary"} className={`fixed bottom-6 right-6 rounded-full h-14 w-14 text-2xl button-transition ${isMainLayoutButton ? 'animate-nested-add-button-3' : 'transition-transform'}`}>
                    {/* <ChartNoAxesCombined width={15} height={15} /> */}
                    {INVESTMENTS_EMOJI}
                  </Button>
                :
                investmentToEdit ?
                <Button variant={variant} className="flex flex-row justify-start items-center gap-1 w-full">
                  <Edit width={15} height={15} />
                  <p>Edit investment</p>
                </Button>
                :
                  <Button variant={variant} className="flex flex-row justify-start items-center gap-1 w-full">
                    <Plus width={15} height={15} />
                    <p>Add an investment</p>
                  </Button>
                )}
            </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent className="px-2 py-1 rounded-md mb-2">
                <p>Add an Investment</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        <DialogContent className="w-1/2">
          <DialogHeader>
          <DialogTitle className="w-full">Add a new Investment</DialogTitle>
          <DialogDescription>
            Add a new investment to keep track of it
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
                    <Input placeholder="Investment name" {...field} />
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
                    <Input placeholder="ETF investment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amountInvested"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount invested*</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-1">
              <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                      <FormItem className="flex flex-col w-1/2">
                      <FormLabel>Start date*</FormLabel>
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
                  name="endDate"
                  render={({ field }) => (
                      <FormItem className="flex flex-col w-1/2">
                      <FormLabel>End date*</FormLabel>
                      <Popover>
                          <PopoverTrigger asChild>
                          <FormControl>
                              <Button
                              variant={"outline"}
                              className={cn(
                                  "pl-3 text-left font-normal",
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
            </div>
            <FormDescription>
              If the investment has no end date, just asign a very distant date
            </FormDescription>
            <FormField
              control={form.control}
              name="investmentCategoriesId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment categories</FormLabel>
                  <MultiSelect
                    defaultValue={field.value ? field.value : []}
                    options={investmentCategories.map((item) => ({label: item.investmentCategoryName, value: item.id, color: item.color}))}
                    onValueChange={field.onChange}
                    placeholder="Select a set of investment categories"
                    variant={"secondary"}
                    animation={2}
                    renderBadge={true}
                    onEdit={(optionId) => {setInvestmentCategoryToEdit(investmentCategories.find((item) => item.id === optionId)); setIsInvestmentCategoryModalOpen(true)}}
                    onDelete={() => {}}
                  >
                    <Button variant={"ghost"} className="w-full flex flex-row" onClick={() => setIsInvestmentCategoryModalOpen(true)}>
                      <Plus />
                      <p>Add a new investment category</p>
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
                {isLoading ? "Creating..." : "Add Investment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        {isInvestmentCategoryModalOpen &&
        <AddInvestmentCategoryModal isMainLayoutButton={false} isMainButton={false} isOpen={isInvestmentCategoryModalOpen} setIsOpen={(isOpen) => setIsInvestmentCategoryModalOpen(isOpen)} renderButton={false} investmentCategoryToEdit={investmentCategoryToEdit} resetInvestmentCategoryToEdit={() => {setInvestmentCategoryToEdit(undefined); setIsInvestmentCategoryModalOpen(false)}}/>
        }
        {isBankAccountsModalOpen &&
        <AddBankAccountDialog isMainLayoutButton={isMainLayoutButton} isMainButton={false} isOpen={isBankAccountsModalOpen} setIsOpen={(isOpen) => setIsBankAccountsModalOpen(isOpen)} renderButton={false} bankAccountToEdit={bankAccountToEdit} resetBankAccountToEdit={() => {setBankAccountToEdit(undefined); setIsBankAccountsModalOpen(false)}}/>
        }
      </DialogContent>
    </Dialog>
  )
}

export default AddInvestmentModal;
