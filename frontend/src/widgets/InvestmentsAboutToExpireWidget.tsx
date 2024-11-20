import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserData } from '@/context/UserDataContext'

const InvestmentsAboutToExpireWidget = () => {

    const {bankAccounts} = useUserData();

    const totalBalance = bankAccounts.reduce((acc, account) => acc + account.currentBalance + account.totalInvested, 0);
    const liquidity = bankAccounts.reduce((acc, account) => acc + account.currentBalance, 0);
    const initialAmount = bankAccounts.reduce((acc, account) => acc + account.initialAmount, 0);
    const amountInvested = bankAccounts.reduce((acc, account) => acc + account.totalInvested, 0);
    const totalExpenses = bankAccounts.reduce((acc, account) => acc + account.totalExpenses, 0);
    const totalIncomes = bankAccounts.reduce((acc, account) => acc + account.totalIncome, 0);
    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Investments about to expire</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-2 '>
                <div className='flex flex-row w-full justify-between items-center gap-8'>
                    <p className='text-muted-foreground text-sm'>Total:</p>
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
                    <p className='text-md'>{}</p>
                </div>
                <div className='flex flex-row w-full justify-between items-center gap-8'>
                    <p className='text-muted-foreground text-sm'>Amount Invested:</p>
                    <p className='text-md'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(amountInvested)}</p>
                </div>
                <div className='flex flex-row w-full justify-between items-center gap-8'>
                    <p className='text-muted-foreground text-sm'>Average Monthly Expense:</p>
                    <p className='text-md'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(totalExpenses)} - {(totalExpenses/totalIncomes).toFixed(2)}%</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default InvestmentsAboutToExpireWidget
