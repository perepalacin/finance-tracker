import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserData } from '@/context/UserDataContext'

const NetworthWidget = () => {

    const {bankAccounts, incomeAndExpensesChartData} = useUserData();

    const totalBalance = bankAccounts.reduce((acc, account) => acc + account.currentBalance, 0) ?? 0;
    const initialAmount = bankAccounts.reduce((acc, account) => acc + account.initialAmount, 0) ?? '';
    const averageIncome = (incomeAndExpensesChartData.reduce((acc, month) => acc + month.income, 0) / incomeAndExpensesChartData.length) || 0;
    const averageExpense = (incomeAndExpensesChartData.reduce((acc, month) => acc + month.expense, 0) / incomeAndExpensesChartData.length) || 0;
    const amountInvested = bankAccounts.reduce((acc, account) => acc + account.totalInvested, 0) ?? 0;
    const liquidity = bankAccounts.reduce((acc, account) => acc + account.currentBalance, 0) - amountInvested;
    // const totalIncomes = bankAccounts.reduce((acc, account) => acc + account.totalIncome, 0);
    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Your Networth</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-2 '>
                <div className='flex flex-row w-full justify-between items-center gap-8'>
                    <p className='text-muted-foreground text-sm'>Total Networth:</p>
                    <p className='text-md'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(totalBalance)}</p>
                </div>
                <div className='flex flex-row w-full justify-between items-center gap-8'>
                    <p className='text-muted-foreground text-sm'>Liquidity:</p>
                    <p className='text-md'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(liquidity)}</p>
                </div>
                <div className='flex flex-row w-full justify-between items-center gap-8'>
                    <p className='text-muted-foreground text-sm'>Initial amount:</p>
                    <p className='text-md'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(initialAmount)}</p>
                </div>
                <div className='flex flex-row w-full justify-between items-center gap-8'>
                    <p className='text-muted-foreground text-sm'>Total growth:</p>
                    <p className='text-md'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(totalBalance-initialAmount)}</p>
                </div>
                <div className='flex flex-row w-full justify-between items-center gap-8'>
                    <p className='text-muted-foreground text-sm'>Average Monthly Income:</p>
                    <p className='text-md'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(averageIncome)}</p>
                </div>
                <div className='flex flex-row w-full justify-between items-center gap-8'>
                    <p className='text-muted-foreground text-sm'>Amount Invested:</p>
                    <p className='text-md'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(amountInvested)}</p>
                </div>
                <div className='flex flex-row w-full justify-between items-center gap-8'>
                    <p className='text-muted-foreground text-sm'>Average Monthly Expense:</p>
                    <p className='text-md'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(averageExpense)}</p>
                </div>
                <div className='flex flex-row w-full justify-between items-center gap-8'>
                    <p className='text-muted-foreground text-sm'>Average Monthly Saving:</p>
                    <p className='text-md'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(averageIncome - averageExpense)}</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default NetworthWidget
