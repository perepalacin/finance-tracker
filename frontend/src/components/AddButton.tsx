import { PlaneLanding, PlaneTakeoff, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import AddBankAccountModal from './modals/AddBankAccountModal';
import AddInvestmentModal from './modals/AddInvestmentModal';
import AddIncomeModal from './modals/AddIncomeModal';

const AddButton = () => {

    const [areOptionsVisible, setAreOptionsVisible] = useState(false); 

    return (
    <>
    {areOptionsVisible &&
        <>
            <AddBankAccountModal areOptionsVisible={areOptionsVisible} isMainButton={true} />
            <AddInvestmentModal areOptionsVisible={areOptionsVisible} isMainButton={true}/>
            <AddIncomeModal areOptionsVisible={areOptionsVisible} isMainButton={true}/>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={"secondary"} className={`absolute bottom-6 right-6 rounded-full h-12 w-12 button-transition ${areOptionsVisible ? 'animate-nested-add-button-1' : 'transition-transform'}`}>
                            {String.fromCodePoint(0x1F4B8)}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card px-2 py-1 rounded-md mb-2">
                    <p>Add an Expense</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </>
    }
    <Button variant={"outline"} className={`absolute bottom-6 right-6 rounded-full h-12 w-12 button-transition transition-transform ${areOptionsVisible ? 'animate-add-button' : ''}`} onClick={() => {setAreOptionsVisible(prevState => !prevState)}}>
        <Plus className='w-full h-full' strokeWidth={3} />
    </Button>
    </>
    
  )
}

export default AddButton
