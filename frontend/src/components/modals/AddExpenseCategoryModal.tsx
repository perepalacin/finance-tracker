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
import { IdCard, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { redirect } from "react-router-dom";
import { useUserData } from "@/context/UserDataContext";
import { AddButtonsProps } from "@/types";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useTheme } from "@/context/ThemeContext";


const AddExpenseCategorySchema = z.object({
    categoryName: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(30, { message: "Name must be at most 30 characters long." }),
    iconName: z
      .string()
      .min(1, { message: "Expense Category Icon is required"})
});

type AddExpenseCategoryFormValues = z.infer<typeof AddExpenseCategorySchema>;

const AddExpenseCategoryModal: React.FC<AddButtonsProps> =({isMainLayoutButton, isMainButton, variant="ghost", isOpen=false, setIsOpen,  renderButton = true}) => {
  const [open, setOpen] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const { expenseCategories, setExpenseCategories } = useUserData();
  const { theme }= useTheme();

  const form = useForm<AddExpenseCategoryFormValues>({
    resolver: zodResolver(AddExpenseCategorySchema),
    defaultValues: {
      categoryName: "",
      iconName: "0x1F6EB",
    },
  });

  const onSubmit = ( data: AddExpenseCategoryFormValues) => {
    setIsLoading(true);

    const token = localStorage.getItem('token');
    axios.post(
      "/api/v1/categories",
      {
        categoryName: data.categoryName,
        iconName: data.iconName,
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
            title: "Expense category Created!",
            description: data.categoryName + " has been added successfully.",
          });
          const newExpenseCategories = [...expenseCategories];
          newExpenseCategories.push(response.data);
          setExpenseCategories(newExpenseCategories);
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
            description: "Unable to create expense category. Please try again later.",
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
                {renderButton && 
                ( isMainButton ?
                  <Button variant={"secondary"} className={`absolute bottom-6 right-6 rounded-full h-12 w-12 button-transition ${isMainLayoutButton ? 'animate-nested-add-button-4' : 'transition-transform'}`}>
                    <IdCard width={15} height={15} />
                  </Button>
                :
                  <Button variant={variant} className="flex flex-row items-center gap-1 w-full">
                    <Plus width={15} height={15} />
                    <p>Add a new expense category</p> 
                  </Button>
                )
                }
            </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent className="bg-card px-2 py-1 rounded-md mb-2">
                <p>Add an Expense Category</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new Expense Category</DialogTitle>
          <DialogDescription>
            Create a new expense category to be able to track your expenses.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Traveling" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iconName"
              render={({ field }) => (
                <FormItem className="flex flex-row gap-2 items-center space-y-0">
                  <FormLabel>Icon:*</FormLabel>
                  <FormControl>
                    <>
                        <Button type="button" variant={"outline"} className="text-2xl relative w-12 h-12" onClick={(e) => {e.stopPropagation(); setIsEmojiModalOpen(true)}}>
                            {String.fromCodePoint(parseInt(field.value, 16))}
                            {
                                isEmojiModalOpen &&
                                <div className="absolute -top-24 left-4">
                                    <Picker theme={theme} onClickOutside={() => {setIsEmojiModalOpen(false)}} data={data} onEmojiSelect={(data) => {setIsEmojiModalOpen(false); field.onChange('0x' + data.unified)}}/>
                                </div>
                            }
                        </Button>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Expense Caregory"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddExpenseCategoryModal;
