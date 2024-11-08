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
import { IdCard } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { redirect } from "react-router-dom";
import { useUserData } from "@/context/UserDataContext";

interface AddButtonsProps {
  areOptionsVisible: boolean;
}

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

const AddBankAccountDialog: React.FC<AddButtonsProps> =({areOptionsVisible}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { bankAccounts, setBankAccounts } = useUserData();

  const form = useForm<AddBankAccountFormValues>({
    resolver: zodResolver(AddBankAccountSchema),
    defaultValues: {
      name: "",
      initialAmount: 0,
    },
  });

  const onSubmit = (data: AddBankAccountFormValues) => {
    setIsLoading(true);

    const token = localStorage.getItem('token');
    axios.post(
      "/api/v1/accounts",
      {
        name: data.name,
        initialAmount: data.initialAmount,
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
          const newBankAccounts = [...bankAccounts];
          newBankAccounts.push(response.data);
          setBankAccounts(newBankAccounts);
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
              <Button variant={"secondary"} className={`absolute bottom-6 right-6 rounded-full h-12 w-12 button-transition ${areOptionsVisible ? 'animate-nested-add-button-4' : 'transition-transform'}`}>
                <IdCard width={15} height={15} />
              </Button>
            </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent className="bg-card px-2 py-1 rounded-md mb-2">
                <p>Add a Bank Account</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new Bank Account</DialogTitle>
          <DialogDescription>
            Create a new bank account to be able to associate expenses, incomes and investments to it.
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
                {isLoading ? "Creating..." : "Create account"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddBankAccountDialog;
