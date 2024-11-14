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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useUserData } from "@/context/UserDataContext";
import { AddButtonsProps, IncomeSourceProps } from "@/types";
import { ColorPicker } from "../ui/color-picker";
import { AdminApi } from "@/helpers/Api";

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
    const api = new AdminApi();

    const body = {
      name: data.name,
      color: data.color,
    };

    const handleSuccessApiCall = (data: IncomeSourceProps) => {
      if (incomeSourceToEdit) {  
        const updatedSources = incomeSources.map((source: IncomeSourceProps) => {
          if (source.id === incomeSourceToEdit.id) {
            return data; 
          } else {
            return source; 
          }
        });
        setIncomeSources(updatedSources);
      } else {
        const newSources = [...incomeSources];
        newSources.push(data);
        newSources.sort((a, b) => a.name.localeCompare(b.name)); 
        setIncomeSources(newSources);
      }
      setOpen(false);
      form.reset();
      if (resetIncomeSourceToEdit) {
        resetIncomeSourceToEdit();
      }
    }

    const handleFinishApiCall = () => {
      setIsLoading(false);
    }

    if (incomeSourceToEdit) {
      api.sendRequest("PUT", "/api/v1/sources/" + incomeSourceToEdit.id, { body: body, showToast: true, successToastMessage: data.name + " has been created!", successToastTitle: "Success", onSuccessFunction: (data) => handleSuccessApiCall(data), onFinishFunction: handleFinishApiCall})
    } else {
    api.sendRequest("POST", "/api/v1/sources", { body: body, showToast: true, successToastMessage: data.name + " has been created!", successToastTitle: "Success", onSuccessFunction: (data) => handleSuccessApiCall(data), onFinishFunction: handleFinishApiCall})
    }
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
