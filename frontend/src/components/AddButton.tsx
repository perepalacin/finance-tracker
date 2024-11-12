import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'
import AddBankAccountModal from './modals/AddBankAccountModal';
import AddInvestmentModal from './modals/AddInvestmentModal';
import AddIncomeModal from './modals/AddIncomeModal';
import AddExpenseModal from './modals/AddExpenseModal';

const AddButton = () => {

    const [isMainLayoutButton, setisMainLayoutButton] = useState(false); 

    return (
    <>
    {isMainLayoutButton &&
        <>
            <AddBankAccountModal isMainLayoutButton={isMainLayoutButton} isMainButton={true} />
            <AddInvestmentModal isMainLayoutButton={isMainLayoutButton} isMainButton={true}/>
            <AddIncomeModal isMainLayoutButton={isMainLayoutButton} isMainButton={true}/>
            <AddExpenseModal isMainLayoutButton={isMainLayoutButton} isMainButton={true} />
        </>
    }
    <Button variant={"outline"} className={`absolute bottom-6 right-6 rounded-full h-14 w-14 button-transition transition-transform ${isMainLayoutButton ? 'animate-add-button' : ''}`} onClick={() => {setisMainLayoutButton(prevState => !prevState)}}>
        <Plus className='w-full h-full' strokeWidth={3} />
    </Button>
    </>
    
  )
}

export default AddButton
