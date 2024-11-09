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
import { ColorPicker } from "../ui/color-picker";
import { OPACITY_BG_CHANGE } from "@/helpers/Constants";

const AddInvestmentCategorySchema = z.object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(30, { message: "Name must be at most 30 characters long." }),
    color: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6})$/, { message: "Color must be a valid hex code like '#ABCDEF'." }),
});

type AddInvestmentCategoryFormValues = z.infer<typeof AddInvestmentCategorySchema>;

const AddInvestmentCategoryModal: React.FC<AddButtonsProps> =({areOptionsVisible, isMainButton, variant="ghost", isOpen=false, setIsOpen,  renderButton = true}) => {
  const [open, setOpen] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const { investmentCategories, setInvestmentCategories } = useUserData();

  const form = useForm<AddInvestmentCategoryFormValues>({
    resolver: zodResolver(AddInvestmentCategorySchema),
    defaultValues: {
      name: "",
      color: '#FF0000',
    },
  });

  const onSubmit = ( data: AddInvestmentCategoryFormValues) => {
    setIsLoading(true);

    const token = localStorage.getItem('token');
    axios.post(
      "/api/v1/investment-categories",
      {
        investmentCategoryName: data.name,
        color: data.color,
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
            title: "Investment Category Created!",
            description: data.name + " has been added successfully.",
          });
          const newInvestmentCategories = [...investmentCategories];
          newInvestmentCategories.push(response.data);
          setInvestmentCategories(newInvestmentCategories);
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
            description: "Unable to create investment category. Please try again later.",
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
                  <Button variant={"secondary"} className={`absolute bottom-6 right-6 rounded-full h-12 w-12 button-transition ${areOptionsVisible ? 'animate-nested-add-button-4' : 'transition-transform'}`}>
                    <IdCard width={15} height={15} />
                  </Button>
                :
                  <Button variant={variant} className="flex flex-row items-center gap-1 w-full">
                    <Plus width={15} height={15} />
                    <p>Add a new investment category</p> 
                  </Button>
                )
                }
            </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent className="bg-card px-2 py-1 rounded-md mb-2">
                <p>Add an Investment Category</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new Investment Category</DialogTitle>
          <DialogDescription>
            Create a new investment category to be able to organize your investments.
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
                    <Input placeholder="Crypyo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="flex flex-row gap-2 items-center space-y-0">
                  <FormLabel>Color*</FormLabel>
                  <FormControl>
                    <ColorPicker value={field.value + OPACITY_BG_CHANGE} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Investment Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddInvestmentCategoryModal;
