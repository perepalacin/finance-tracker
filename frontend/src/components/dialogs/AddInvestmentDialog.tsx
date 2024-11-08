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
import { CalendarIcon, ChartNoAxesCombined, IdCard } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { redirect } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MultiSelect } from "../ui/multi-select";
import { useUserData } from "@/context/UserDataContext";


interface AddButtonsProps {
  areOptionsVisible: boolean;
}

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
    investmentCategoriesIds: z
      .array(z.string()),
    bankAccountId: z.string().uuid({message: "Please assign this investment a Bank Account"})
    
});

type AddInvestmentFormValues = z.infer<typeof AddInvestmentSchema>;

const AddInvestmentDialog: React.FC<AddButtonsProps> =({areOptionsVisible}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { investmentCategories, setInvestmentCategories, bankAccounts } = useUserData();
  const IdCardIcon = () => <IdCard />;

  const form = useForm<AddInvestmentFormValues>({
    resolver: zodResolver(AddInvestmentSchema),
    defaultValues: {
      name: "",
      amountInvested: 0,
      
    },
  });

  const onSubmit = (data: AddInvestmentFormValues) => {
    setIsLoading(true);

    const token = localStorage.getItem('token');
    axios.post(
      "/api/v1/accounts",
      {
        name: data.name,
        amountInvested: data.amountInvested,
        annotation: data.annotation
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
            title: "Bank Account Created!",
            description: data.name + " has been added successfully.",
          });
          setOpen(false);
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
            description: "Unable to create bank account. Please try again later.",
          })
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
              <Button variant={"secondary"} className={`absolute bottom-6 right-6 rounded-full h-12 w-12 button-transition ${areOptionsVisible ? 'animate-nested-add-button-3' : 'transition-transform'}`}>
                <ChartNoAxesCombined width={15} height={15} />
              </Button>
            </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent className="bg-card px-2 py-1 rounded-md mb-2">
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
              name="investmentCategoriesIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment categories</FormLabel>
                  <MultiSelect
                    options={investmentCategories.map((item) => ({label: item.investmentCategoryName, value: item.id, color: item.color + '63'}))}
                    onValueChange={field.onChange}
                    placeholder="Select a set of investment categories"
                    variant={"secondary"}
                    animation={2}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Account</FormLabel>
                  <MultiSelect
                    options={bankAccounts.map((item) => ({label: item.name, value: item.id, icon: IdCardIcon}))}
                    onValueChange={field.onChange}
                    placeholder="Select a set of investment categories"
                    variant={"secondary"}
                    animation={2}
                    maxCount={1}
                  />
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
      </DialogContent>
    </Dialog>
  )
}

export default AddInvestmentDialog;
