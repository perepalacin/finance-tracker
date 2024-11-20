import NetworthWidget from '@/widgets/NetworthWidget'
import KpiWidgets from '@/widgets/KpiWidgets'
import ExpensesIncomesChart from '@/widgets/ExpensesIncomesChart'
import CategoriesWidget from '@/widgets/CategoriesWidget'
import NetWorthGraph from '@/widgets/NetWorthGraph'
import IncomeSourcesChart from '@/widgets/IncomeSourcesChart'
import InvestmentDiversificationGraph from '@/widgets/InvestmentDiversificationGraph'
import InvestmentsAboutToExpireWidget from '@/widgets/InvestmentsAboutToExpireWidget'

const Dashboard = () => {
  return (
    <div className='flex flex-col gap-2 justify-center w-full'>
        <div className='flex flex-row gap-2 items-start w-full'>
            <div className='flex flex-col gap-2 items-start justify-center w-1/4'>
                <NetworthWidget />
                <IncomeSourcesChart />
                <InvestmentDiversificationGraph/>
                <InvestmentsAboutToExpireWidget />
            </div>
            <div className='flex flex-col gap-2 w-2/5'>
                <KpiWidgets />  
                <ExpensesIncomesChart />
                <NetWorthGraph />
            </div>
            <div className='w-1/3'>
                <CategoriesWidget />
            </div>
        </div>
    </div>
  )
}

export default Dashboard
