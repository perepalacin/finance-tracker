import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useUserData } from "@/context/UserDataContext"

const IncomeSourcesChart = () => {

  const { incomeSourcesTopGraph, incomeSources, incomeAndExpensesChartData } = useUserData();

  const chartData: {categoryName: string, amount: number, fill: string}[] = [];
  if (incomeSourcesTopGraph.length > 1) {
    incomeSourcesTopGraph.forEach((value, index) => {
      if (index < 4) {
        const incomeSource = incomeSources.find((source) => source.id === value.incomeSourceId);
        if (incomeSource) {
          chartData.push({
            categoryName: incomeSource.name,
            amount: value.amount,
            fill: incomeSource.color
          });
        }
      }
    })
  }

  const chartConfig: any = {
    amount: {
      label: "Amount"
    }
  };
  chartData.forEach((item) => {
    chartConfig[item.categoryName] = {
      label: item.categoryName,
      color: item.fill
    }
  });


  let chartSubtitle = "";
  if (incomeAndExpensesChartData.length > 1) {
    if (incomeAndExpensesChartData[0].period.split('.')[1] === incomeAndExpensesChartData[incomeAndExpensesChartData.length-1].period.split('.')[1]) {
      chartSubtitle = incomeAndExpensesChartData[incomeAndExpensesChartData.length-1].period.split('.')[1] + ": " + incomeAndExpensesChartData[0].period.split('.')[0] + " - " + incomeAndExpensesChartData[incomeAndExpensesChartData.length-1].period.split('.')[0];
    } else {
      chartSubtitle = incomeAndExpensesChartData[0].period + ' - ' + incomeAndExpensesChartData[incomeAndExpensesChartData.length-1].period;
    }
  } else if (incomeAndExpensesChartData.length === 1) {
    chartSubtitle = incomeAndExpensesChartData[0].period;
  }

  chartData.sort((a, b) => b.amount - a.amount);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top 5 Income Sources</CardTitle>
        <CardDescription>{chartSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="categoryName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              style={{fontSize: '0.5rem'}}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="amount" type="number" hide />
            <ChartTooltip
              formatter={(value, i: string, c: any) => { 
                return <div className="flex flex-row gap-2 items-center"><div className = 'w-2 h-2' style={{backgroundColor: c.payload.fill, borderRadius: '0.1rem'}}/>{i.charAt(0).toUpperCase() + i.slice(1) + ": "}<span className="font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(Number(value))}</span></div>;
              }} 
              cursor={false} 
              content={<ChartTooltipContent />} 
            />
            <Bar dataKey="amount" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default IncomeSourcesChart;