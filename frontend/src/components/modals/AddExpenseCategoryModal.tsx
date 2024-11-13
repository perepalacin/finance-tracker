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
import { useUserData } from "@/context/UserDataContext";
import { AddButtonsProps, ExpenseCategoryProps } from "@/types";
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

interface AddExpenseCategoryModalProps extends AddButtonsProps {
    expenseCategoryToEdit?: ExpenseCategoryProps;
    resetExpenseCategoryToEdit?: () => void;
}

const AddExpenseCategoryModal: React.FC<AddExpenseCategoryModalProps> =({isMainLayoutButton, isMainButton, variant="ghost", isOpen=false, setIsOpen,  renderButton = true, expenseCategoryToEdit, resetExpenseCategoryToEdit}) => {
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
    defaultValues: expenseCategoryToEdit ? {
        categoryName: expenseCategoryToEdit.categoryName,
        iconName: expenseCategoryToEdit.iconName,
    } :{
      categoryName: "",
      iconName: "0x1F6EB",
    },
  });

  const onSubmit = (data: AddExpenseCategoryFormValues) => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    const url = expenseCategoryToEdit ? `/api/v1/categories/${expenseCategoryToEdit.id}` : "/api/v1/categories";
    const method = expenseCategoryToEdit ? axios.put : axios.post;

    method(url, {
      categoryName: data.categoryName,
      iconName: data.iconName,
    }, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        const successMessage = expenseCategoryToEdit ? "Expense category updated!" : "Expense category created!";
        toast({
          variant: "success",
          title: successMessage,
          description: data.categoryName + " has been added successfully.",
        });
        if (response.status === 201) {
          const newExpenseCategories = [...expenseCategories];
          newExpenseCategories.push(response.data);
          setExpenseCategories(newExpenseCategories);
        } else if (response.status === 200 && expenseCategoryToEdit) {
          const updatedExpenseCategories = expenseCategories.map((category: ExpenseCategoryProps) => {
            if (category.id === expenseCategoryToEdit.id) {
              return response.data;
            } else {
              return category;
            }
          });
          setExpenseCategories(updatedExpenseCategories);
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
      if (resetExpenseCategoryToEdit) {
        resetExpenseCategoryToEdit();
      }
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (setIsOpen) {setIsOpen(open); if (resetExpenseCategoryToEdit) {resetExpenseCategoryToEdit()}}}}>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                {renderButton && 
                ( isMainButton ?
                  <Button variant={"secondary"} className={`absolute bottom-6 right-6 rounded-full h-12 w-12 button-transition ${isMainLayoutButton ? 'animate-nested-add-button-4' : 'transition-transform'}`}>
                    {String.fromCodePoint(0x1FAAA)}
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
              <TooltipContent className="px-2 py-1 rounded-md mb-2">
                <p>Add an Expense Category</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{expenseCategoryToEdit ? "Update Expense Category" : "Add a new Expense Category" }</DialogTitle>
          <DialogDescription>
            {expenseCategoryToEdit ? "" : "Create a new expense category to be able to track your expenses."}
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
                    <Input placeholder="Traveling" {...field} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iconName"
              render={({ field }) => (
                <FormItem className="flex flex-wrow gap-2 items-center space-y-0">
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
                {isLoading ? expenseCategoryToEdit ? "Updating..." : "Creating..." : expenseCategoryToEdit ? "Edit Expense Category" : "Create Expense Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddExpenseCategoryModal;
