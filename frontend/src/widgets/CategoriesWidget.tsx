import { Card } from '@/components/ui/card';
import { useUserData } from '@/context/UserDataContext'
import { AdminApi } from '@/helpers/Api';
import { ExpensesCategoryWithAmountDto } from '@/types';
import { useEffect, useState } from 'react';

interface ExpenseCategoryWidgetDataProps {
    id: string;
    iconName: number;
    categoryName: string;
    totalAmount: number;
    monthlyAmount: number;
}

const CategoriesWidget = () => {

    const [expensesByCategoriesDto, setExpensesByCategoriesDto] = useState<ExpenseCategoryWidgetDataProps[]>([]);
    const {expenseCategories, bankAccounts} = useUserData();

    const totalExpenses = bankAccounts.reduce((acc, account) => acc + account.totalExpenses, 0);

    useEffect(() => {

        const onSuccessFetchExpensesByCategories = (data: ExpensesCategoryWithAmountDto[]) => {
            const newExpensesByCategoriesDto: ExpenseCategoryWidgetDataProps[] = [];
            data.forEach((category) => {
                const expenseCategory = expenseCategories.find((c) => c.id === category.expenseCategoryId);
                if (expenseCategory) {
                    newExpensesByCategoriesDto.push({
                        id: category.expenseCategoryId,
                        iconName: Number(expenseCategory.iconName),
                        categoryName: expenseCategory.categoryName,
                        totalAmount: category.totalAmount,
                        monthlyAmount: category.monthlyAmount
                    });
                }
            });

            if (newExpensesByCategoriesDto.length > 0) {
                setExpensesByCategoriesDto(newExpensesByCategoriesDto);
            }
        }

        const api = new AdminApi();
        api.sendRequest("GET", "/api/v1/dashboard/category-expenses", {onSuccessFunction: onSuccessFetchExpensesByCategories})
    }, [expenseCategories]);

    return (
    <div className='grid grid-cols-1 lg:grid-cols-2 w-full gap-2'>
        {expensesByCategoriesDto.map((category: ExpenseCategoryWidgetDataProps) => 
        <Card key={category.id} className='p-4 flex flex-col gap-2 items-start justify-center w-full'>
        <div className='flex flex-row justify-start gap-2'>
            <p>{String.fromCodePoint(category.iconName)}</p>
            <h1>{category.categoryName}</h1>
        </div>
        <div className='flex flex-col gap-2 w-full'>
            <div className='flex flex-row w-full justify-between items-center gap-8'>
                <p className='text-muted-foreground text-sm'>Total:</p>
                <p className='text-sm'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(category.totalAmount)}</p>
            </div>
            <div className='flex flex-row w-full justify-between items-center gap-8'>
                <p className='text-muted-foreground text-sm'>Monthly:</p>
                <p className='text-sm'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(category.monthlyAmount)}</p>
            </div>
            <div className='flex flex-row w-full justify-between items-center gap-8'>
                <p className='text-muted-foreground text-sm'>Percent (total):</p>
                <p className='text-sm'>{(category.totalAmount/totalExpenses).toFixed(2)}%</p>
            </div>
        </div>
    </Card>
)}    
    </div>
  )
}

export default CategoriesWidget
