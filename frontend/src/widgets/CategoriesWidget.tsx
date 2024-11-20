import { Card } from '@/components/ui/card';
import { useUserData } from '@/context/UserDataContext'

const CategoriesWidget = () => {
    const {expenseCategories} = useUserData();

    return (
    <div className='grid grid-cols-1 lg:grid-cols-2 w-full gap-2'>
        {expenseCategories.map((category) => 
        <Card className='p-4 flex flex-col gap-2 items-start justify-center w-full'>
        <div className='flex flex-row justify-start gap-2'>
            <p>{String.fromCodePoint(Number(category.iconName))}</p>
            <h1>{category.categoryName}</h1>
        </div>
        <div className='flex flex-col gap-2 w-full'>
            <div className='flex flex-row w-full justify-between items-center gap-8'>
                <p className='text-muted-foreground text-sm'>Monthly:</p>
                <p className='text-sm'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(12)}</p>
            </div>
            <div className='flex flex-row w-full justify-between items-center gap-8'>
                <p className='text-muted-foreground text-sm'>Yearly:</p>
                <p className='text-sm'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(12)}</p>
            </div>
            <div className='flex flex-row w-full justify-between items-center gap-8'>
                <p className='text-muted-foreground text-sm'>Percent:</p>
                <p className='text-sm'>{(2.69).toFixed(2)}%</p>
            </div>
        </div>
    </Card>
)}    
    </div>
  )
}

export default CategoriesWidget
