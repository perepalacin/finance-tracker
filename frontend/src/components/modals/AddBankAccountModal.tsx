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
import { Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { redirect } from "react-router-dom";
import { useUserData } from "@/context/UserDataContext";
import { AddButtonsProps } from "@/types";

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

const AddBankAccountModal: React.FC<AddButtonsProps> =({isMainLayoutButton, isMainButton, variant="ghost", isOpen = false, setIsOpen, renderButton =true}) => {
  const [open, setOpen] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);

  const { bankAccounts, setBankAccounts } = useUserData();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen])

  const form = useForm<AddBankAccountFormValues>({
    resolver: zodResolver(AddBankAccountSchema),
    defaultValues: {
      name: "",
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
            description: "Unable to create bank account. Please try again later.",
          })
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  
  return (
    <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (setIsOpen) {setIsOpen(open); }}} >
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                {renderButton &&
                ( isMainButton ?
                  <Button variant={"secondary"} className={`absolute bottom-6 right-6 rounded-full h-12 w-12 button-transition ${isMainLayoutButton ? 'animate-nested-add-button-4' : 'transition-transform'}`}>
                    {/* <IdCard width={15} height={15} /> */}
                    {String.fromCodePoint(0x1F3E6)}
                  </Button>
                :
                  <Button variant={variant} className="flex flex-row items-center gap-1 w-full">
                    <Plus width={15} height={15} />
                    <p>Add a new bank account</p> 
                  </Button>
                )
              }
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

export default AddBankAccountModal;
