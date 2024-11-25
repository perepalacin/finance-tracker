import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]

const chartConfig = {
  saving: {
    label: "saving",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const NetWorthGraph = () => {

  const {incomeAndExpensesChartData} = useUserData();

  const chartData: {period: string, saving: number}[] = [];
  incomeAndExpensesChartData.forEach((monthlyData) => 
    chartData.push(
      {
        period: monthlyData.period,
        saving: monthlyData.income - monthlyData.expense
      }
    )
  );

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
        <CardTitle>Your Networth Progression</CardTitle>
        <CardDescription>
          {chartSubtitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={true}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillSaving" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-saving)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-saving)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="saving"
              type="natural"
              fill="url(#fillSaving)"
              fillOpacity={0.4}
              stroke="var(--color-saving)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default NetWorthGraph;