import { PlaneLanding, PlaneTakeoff, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'
import AddBankAccountDialog from './dialogs/AddBankAccountDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import AddInvestmentDialog from './dialogs/AddInvestmentDialog';

const AddButton = () => {

    const [areOptionsVisible, setAreOptionsVisible] = useState(false); 

    return (
    <>
    {areOptionsVisible &&
        <>
            <AddBankAccountDialog areOptionsVisible={areOptionsVisible} />
            <AddInvestmentDialog areOptionsVisible={areOptionsVisible} />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={"secondary"} className={`absolute bottom-6 right-6 rounded-full h-12 w-12 button-transition ${areOptionsVisible ? 'animate-nested-add-button-2' : 'transition-transform'}`}>
                            <PlaneLanding width={14} height={14} onClick={() => setAreOptionsVisible(prevstate => !prevstate)} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card px-2 py-1 rounded-md mb-2">
                    <p>Add an Income</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={"secondary"} className={`absolute bottom-6 right-6 rounded-full h-12 w-12 button-transition ${areOptionsVisible ? 'animate-nested-add-button-1' : 'transition-transform'}`}>
                            <PlaneTakeoff width={14} height={14} onClick={() => setAreOptionsVisible(prevstate => !prevstate)} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card px-2 py-1 rounded-md mb-2">
                    <p>Add an Expense</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </>
    }
    <Button variant={"outline"} className={`absolute bottom-6 right-6 rounded-full h-12 w-12 button-transition transition-transform ${areOptionsVisible ? 'animate-add-button' : ''}`} onClick={() => {console.log("click"); setAreOptionsVisible(prevState => !prevState)}}>
        <Plus className='w-full h-full' strokeWidth={3} />
    </Button>
    </>
    
  )
}

export default AddButton
