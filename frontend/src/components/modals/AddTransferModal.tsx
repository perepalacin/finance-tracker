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
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { redirect } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { useUserData } from "@/context/UserDataContext";
import { AddButtonsProps, BankAccountProps, TransferProps } from "@/types";
import AddBankAccountDialog from "./AddBankAccountModal";
import { MultiSelect } from "../ui/multi-select";
import { TRANSFERS_EMOJI, WindowEvents } from "@/helpers/Constants";
import { AdminApi } from "@/helpers/Api";

const AddTransferSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(30, { message: "Name must be at most 30 characters long." }),
    amount: z.coerce
        .number()
        .nonnegative({ message: "Transfer amount must be a positive number." }),
    annotation: z
        .string()
        .optional(),
    date: z.date({required_error: "Start date is required.",}),
    receivingBankAccountId: z.string().uuid({message: "Please assign a bank account to receive this transfer."}),
    sendingBankAccountId: z.string().uuid({message: "Please assign a bank account to send this transfer."})
  });

type AddTransferFormValues = z.infer<typeof AddTransferSchema>;

interface AddTransferButtonProps extends AddButtonsProps {
  transferToEdit?: TransferProps;
  resetTransferToEdit?: () => void;
}

const AddTransferModal: React.FC<AddTransferButtonProps> =({isMainLayoutButton, isMainButton, variant = "ghost", isOpen=false, setIsOpen, renderButton = true, transferToEdit, resetTransferToEdit}) => {
  const [open, setOpen] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [isBankAccountsModalOpen, setIsBankAccountsModalOpen] = useState(false);
  const [sendingBankAccountToEdit, setSendingBankAccountToEdit] = useState<BankAccountProps>();
  const [receivingankAccountToEdit, setReceivingBankAccountToEdit] = useState<BankAccountProps>();
 
  const { bankAccounts } = useUserData();

  const form = useForm<AddTransferFormValues>({
    resolver: zodResolver(AddTransferSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (transferToEdit) {
      form.reset({
        name: transferToEdit.name,
        amount: transferToEdit.amount,
        annotation: transferToEdit.annotation ? transferToEdit.annotation : undefined,
        date: parse(transferToEdit.date, 'dd-MM-yyyy', new Date()),
        sendingBankAccountId: transferToEdit.sendingBankAccountId,
        receivingBankAccountId: transferToEdit.receivingBankAccountId
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [transferToEdit, form]);

  const onSubmit = ( data: AddTransferFormValues) => {
    setIsLoading(true);
    const api = new AdminApi();
    const body = {  
      name: data.name,
      amount: data.amount,
      annotation: data.annotation,
      date: format(data.date, 'dd-MM-yyyy'),
      sendingBankAccountId: data.sendingBankAccountId,
      receivingBankAccountId: data.receivingBankAccountId
    };

    const handleSuccessApiCall = (data: TransferProps) => {
      let eventType = "";
      if (transferToEdit) {  
        eventType = WindowEvents.EDIT_TRANSFER;
      } else {
        eventType = WindowEvents.ADD_TRANSFER;
      };
      setOpen(false);
      form.reset();
      
      const event = new CustomEvent(eventType, { detail: { data: data } });
      window.dispatchEvent(event);
        if (resetTransferToEdit) {
          resetTransferToEdit();
        }
      }
  
      const handleFinishApiCall = () => {
        setIsLoading(false);
      }
  
      if (transferToEdit) {
        api.sendRequest("PUT", "/api/v1/transfers/" + transferToEdit.id, { body: body, showToast: true, successToastMessage: data.name + " has been updated!", successToastTitle: "Success", onSuccessFunction: (data) => handleSuccessApiCall(data), onFinishFunction: handleFinishApiCall})
      } else {
      api.sendRequest("POST", "/api/v1/transfers", { body: body, showToast: true, successToastMessage: data.name + " has been created!", successToastTitle: "Success", onSuccessFunction: (data) => handleSuccessApiCall(data), onFinishFunction: handleFinishApiCall})
      }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (setIsOpen) {setIsOpen(open); }}}>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                { renderButton && (isMainButton ?
                  <Button variant={"secondary"} className={`absolute bottom-6 right-6 rounded-full h-14 w-14 text-2xl button-transition ${isMainLayoutButton ? 'animate-nested-add-button-4' : 'transition-transform'}`}>
                    {TRANSFERS_EMOJI}
                  </Button>
                :
                  <Button variant={variant} className="flex flex-row justify-start items-center gap-1 w-full">
                    {transferToEdit ?
                      <>
                        <Edit width={15} height={15} />
                        <p className="hidden md:block">Edit Transfer</p>  
                      </>
                      :
                      <>
                        <Plus width={15} height={15} />
                        <p className="hidden md:block">Add a Transfer</p>  
                      </>
                    }
                  </Button>
                )}
            </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent className="px-2 py-1 rounded-md mb-2">
                <p>Add a Transfer</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        <DialogContent className="w-1/2">
          <DialogHeader>
          <DialogTitle className="w-full">Add a new Transfer</DialogTitle>
          <DialogDescription>
            Add a new transfer between your bank accounts
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
                    <Input placeholder="Transfer concept" {...field} />
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
                    <Input placeholder="Changing currencies..." {...field} />
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
                  name="date"
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
              name="sendingBankAccountId"
              render={({ field }) => {
                return (
                <FormItem>
                  <FormLabel>Sending Bank Account*</FormLabel>
                  <MultiSelect
                      defaultValue={field.value ? [field.value] : []}
                      options={bankAccounts.map((item) => ({label: item.name, value: item.id, emoji: '0x1FAAA'}))}
                      onValueChange={(data) => {field.onChange(data[0])}}
                      placeholder="Select a bank account"
                      variant={"secondary"}
                      animation={2}
                      isMulti={false}
                      onEdit={(optionId) => {setSendingBankAccountToEdit(bankAccounts.find((item) => item.id === optionId)); setIsBankAccountsModalOpen(true)}}
                      onDelete={() => {}}
                    >
                      <Button variant={"ghost"} className="w-full flex flex-row" onClick={() => setIsBankAccountsModalOpen(true)}>
                        <Plus />
                        <p>Add a new bank account</p>
                      </Button>
                    </MultiSelect>
                  <FormMessage />
                </FormItem>
              )}}
            />
            <FormField
              control={form.control}
              name="receivingBankAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receiving Bank Account*</FormLabel>
                  <MultiSelect
                      defaultValue={field.value ? [field.value] : []}
                      options={bankAccounts.map((item) => ({label: item.name, value: item.id, emoji: '0x1FAAA'}))}
                      onValueChange={(data) => field.onChange(data[0])}
                      placeholder="Select a bank account"
                      variant={"secondary"}
                      animation={2}
                      isMulti={false}
                      onEdit={(optionId) => {setReceivingBankAccountToEdit(bankAccounts.find((item) => item.id === optionId)); setIsBankAccountsModalOpen(true)}}
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
                {isLoading ? transferToEdit ? "Updating..." : "Creating..." : transferToEdit ? "Update transfer" : "Create transfer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        { isBankAccountsModalOpen &&
          <AddBankAccountDialog isMainLayoutButton={false} isMainButton={false} isOpen={isBankAccountsModalOpen} setIsOpen={(isOpen) => setIsBankAccountsModalOpen(isOpen)} renderButton={false} bankAccountToEdit={sendingBankAccountToEdit || receivingankAccountToEdit} resetBankAccountToEdit={() => {setReceivingBankAccountToEdit(undefined); setSendingBankAccountToEdit(undefined); setIsBankAccountsModalOpen(false)}} />
        }
      </DialogContent>
    </Dialog>
  )
}

export default AddTransferModal;
