import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="income"  fill="var(--color-desktop)" radius={2} />
            <Bar dataKey="expense" fill="var(--color-mobile)" radius={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ExpensesIncomesChart;