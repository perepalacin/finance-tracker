import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useUserData } from "@/context/UserDataContext"
import AddExpenseModal from "@/components/modals/AddExpenseModal"
import AddIncomeModal from "@/components/modals/AddIncomeModal"


const chartConfig = {
  desktop: {
    label: "Incomes",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const ExpensesIncomesChart = () => {

  const {incomeAndExpensesChartData: chartData} = useUserData();

  let chartSubtitle = "";
  if (chartData.length > 1) {
    if (chartData[0].period.split('.')[1] === chartData[chartData.length-1].period.split('.')[1]) {
      chartSubtitle = chartData[chartData.length-1].period.split('.')[1] + ": " + chartData[0].period.split('.')[0] + " - " + chartData[chartData.length-1].period.split('.')[0];
    } else {
      chartSubtitle = chartData[0].period + ' - ' + chartData[chartData.length-1].period;
    }
  } else if (chartData.length === 1) {
    chartSubtitle = chartData[0].period;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses & Incomes</CardTitle>
        <CardDescription>{chartSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
      {chartData.length > 0 ? 
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {if (value >=  1000000) {return (value/1000000).toFixed(1) + 'M'}; if (value >=  1000) {return (value/1000).toFixed(2) + 'k'}; return value.toFixed(0)}}
              />
            <ChartTooltip
              cursor={false}
              formatter={(value, i: string, c: any) => { 
                return <div className="flex flex-row gap-2 items-center"><div className = 'w-2 h-2' style={{backgroundColor: c.fill, borderRadius: '0.1rem'}}/>{i.charAt(0).toUpperCase() + i.slice(1) + ": "}<span className="font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(Number(value))}</span></div>;
              }}              
              content={<ChartTooltipContent indicator="dot" />}
              />
            <Bar dataKey="income"  fill="var(--color-desktop)" radius={2} />
            <Bar dataKey="expense" fill="var(--color-mobile)" radius={2} />
          </BarChart>
        </ChartContainer>
      :
      <div className="w-full flex flex-col items-start justify-start gap-4">
        <p>Nothing to see here...</p>
        <div className="flex flex-row gap-2 w-full">
          <AddIncomeModal 
            variant="default"
            isMainButton={false}
            isMainLayoutButton={false}
          />
          <AddExpenseModal
            variant="default"
            isMainButton={false}
            isMainLayoutButton={false}
          />
          </div>
        </div>
        }
      </CardContent>
    </Card>
  )
}

export default ExpensesIncomesChart;