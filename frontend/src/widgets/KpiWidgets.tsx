import { Card } from '@/components/ui/card'
import { shortenedMonthNames, useUserData } from '@/context/UserDataContext'
import { IncomeExpensesGraphData } from '@/types';

const KpiWidgets = () => {

  const {incomeAndExpensesChartData} = useUserData();

  const today = new Date();
  const currentPeriodName = shortenedMonthNames[today.getMonth()] + ". " + today.getFullYear();
  const currentPeriod = incomeAndExpensesChartData.find((monthlyData: IncomeExpensesGraphData) => monthlyData.period === currentPeriodName);
  let monthlyIncome = 0;
  let monthlyExpense = 0;
  let monthlySaving = 0;
  let percentSpent = 0;
  if (currentPeriod) {
    monthlyIncome = currentPeriod.income;
    monthlyExpense = currentPeriod.expense;
    monthlySaving = currentPeriod.income - currentPeriod.expense;
    percentSpent = currentPeriod.expense / currentPeriod.income;
  }

  return (
    <div className='w-full grid grid-cols-2 2xl:grid-cols-4 gap-2'>
      <Card className='p-6'>
            <h1 className='text-sm p-0'>Monthly Income</h1>
        <p className='text-3xl font-semibold'>
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(monthlyIncome)}
        </p>
      </Card>
      <Card className='p-6'>
            <h1 className='text-sm p-0'>Monthly Expense</h1>
        <p className='text-3xl font-semibold'>
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(monthlyExpense)}
        </p>
      </Card>
      <Card className='p-6'>
            <h1 className='text-sm p-0'>Monthly Saving</h1>
        <p className='text-3xl font-semibold'>
        {new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(monthlySaving)}
        </p>
      </Card>
      <Card className='p-6'>
            <h1 className='text-sm p-0'>Percent Spent</h1>
        <p className='text-3xl font-semibold'>
            {percentSpent.toFixed(2) + ' %'}
        </p>
      </Card>
    </div>
  )
}

export default KpiWidgets
