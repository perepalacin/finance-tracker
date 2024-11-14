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
import { AddButtonsProps, IncomeSourceProps } from "@/types";
import { ColorPicker } from "../ui/color-picker";

const AddIncomeSourceSchema = z.object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(30, { message: "Name must be at most 30 characters long." }),
    color: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6})$/, { message: "Color must be a valid hex code like '#ABCDEF'." }),
});

type AddIncomesourceFormValues = z.infer<typeof AddIncomeSourceSchema>;

interface AddIncomeSourceModalProps extends AddButtonsProps {
  incomeSourceToEdit?: IncomeSourceProps;
  resetIncomeSourceToEdit?: () => void;
}

const AddIncomeSourceModal: React.FC<AddIncomeSourceModalProps> =({isMainLayoutButton, isMainButton, variant="ghost", isOpen=false, setIsOpen,  renderButton = true, incomeSourceToEdit, resetIncomeSourceToEdit}) => {
  const [open, setOpen] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const { incomeSources, setIncomeSources } = useUserData();

  const form = useForm<AddIncomesourceFormValues>({
    resolver: zodResolver(AddIncomeSourceSchema),
    defaultValues: incomeSourceToEdit ? {
      name: incomeSourceToEdit.name,
      color: incomeSourceToEdit.color
    } : {
      name: "",
      color: '#FF0000',
    },
  });

  const onSubmit = ( data: AddIncomesourceFormValues) => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    const url = incomeSourceToEdit ? `/api/v1/sources/${incomeSourceToEdit.id}` : "/api/v1/sources";
    const method = incomeSourceToEdit ? axios.put : axios.post;

    method(url, {
      name: data.name,
      color: data.color,
    }, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
        if (response.status === 200) {
            const successMessage = incomeSourceToEdit ? "Income source updated!" : "Income source created!";
            toast({
                variant: "success",
                title: successMessage,
                description: data.name + " has been added successfully.",
            });
            if (!incomeSourceToEdit) {
                const newIncomeSources = [...incomeSources];
                newIncomeSources.push(response.data);
                setIncomeSources(newIncomeSources);
            } else {
                const updatedIncomeSources = incomeSources.map((source: IncomeSourceProps) => {
                    if (source.id === incomeSourceToEdit.id) {
                      return response.data; // Return the updated data for the matching id
                    } else {
                      return source; // Return the original data for non-matching ids
                    }
                });
                setIncomeSources(updatedIncomeSources);
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
      if (resetIncomeSourceToEdit) {
        resetIncomeSourceToEdit();
      }
    });
  };

  
  return (
    <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (setIsOpen) {setIsOpen(open); if (resetIncomeSourceToEdit) {resetIncomeSourceToEdit()} }}}>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                {renderButton && 
                ( isMainButton ?
                  <Button variant={"secondary"} className={`absolute bottom-6 right-6 rounded-full h-12 w-12 button-transition ${isMainLayoutButton ? 'animate-nested-add-button-4' : 'transition-transform'}`}>
                    {/* <IdCard width={15} height={15} /> */}
                    {String.fromCodePoint(0x1FAAA)}
                  </Button>
                :
                  <Button variant={variant} className="flex flex-row items-center gap-1 w-full">
                    <Plus width={15} height={15} />
                    <p>Add a new income source</p> 
                  </Button>
                )
                }
            </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent className="px-2 py-1 rounded-md mb-2">
                <p>Add an Income Source</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> {incomeSourceToEdit ? "Update Income Source" : "Add a new Income Source" } </DialogTitle>
          <DialogDescription>
            {incomeSourceToEdit ? "" : "Create a new income source to be able to organize your incomes." }
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
                    <Input placeholder="Salary" {...field} />
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
                    <ColorPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? incomeSourceToEdit ? "Updating" : "Creating..." : incomeSourceToEdit ? "Update Income source" : "Create Income Source"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddIncomeSourceModal;
