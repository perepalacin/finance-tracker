import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {if (value >=  1000000) {return (value/1000000).toFixed(1) + 'M'}; if (value >=  1000) {return (value/1000).toFixed(2) + 'k'}; return value.toFixed(0)}}
            />
            <ChartTooltip
              formatter={(value, i: string, c: any) => { 
                return <div className="flex flex-row gap-2 items-center"><div className = 'w-2 h-2' style={{backgroundColor: c.stroke, borderRadius: '0.1rem'}}/>{i.charAt(0).toUpperCase() + i.slice(1) + ": "}<span className="font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(Number(value))}</span></div>;
              }} 
              cursor={false} 
              content={<ChartTooltipContent />} 
            />
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