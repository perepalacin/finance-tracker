import { Card } from '@/components/ui/card'

const KpiWidgets = () => {
  return (
    <div className='w-full grid grid-cols-2 2xl:grid-cols-4 gap-2'>
      <Card className='p-6'>
            <h1 className='text-sm p-0'>Monthly Income</h1>
        <p className='text-3xl font-semibold'>
            3000 $
        </p>
      </Card>
      <Card className='p-6'>
            <h1 className='text-sm p-0'>Monthly Expense</h1>
        <p className='text-3xl font-semibold'>
            3000 $
        </p>
      </Card>
      <Card className='p-6'>
            <h1 className='text-sm p-0'>Monthly Saving</h1>
        <p className='text-3xl font-semibold'>
            3000 $
        </p>
      </Card>
      <Card className='p-6'>
            <h1 className='text-sm p-0'>Percent Spent</h1>
        <p className='text-3xl font-semibold'>
            3000 $
        </p>
      </Card>
    </div>
  )
}

export default KpiWidgets
