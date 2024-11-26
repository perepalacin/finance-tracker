"use client"

import { Label, Pie, PieChart } from "recharts"

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

const InvestmentDiversificationGraph = () => {

  const { investmentCategories, bankAccounts, incomeAndExpensesChartData, investmentCategoriesTopGraph } = useUserData();

  const totalAmountInvested = bankAccounts.reduce((acc, account) => acc + account.totalInvested, 0);

  const chartData: {categoryName: string, amount: number, fill: string}[] = [];
  if (investmentCategoriesTopGraph.length > 1) {
    investmentCategoriesTopGraph.forEach((value, index) => {
      if (index < 4) {
        const investmentCategory = investmentCategories.find((source) => source.id === value.investmentCategoryId);
        if (investmentCategory) {
          chartData.push({
            categoryName: investmentCategory.investmentCategoryName,
            amount: (value.amount / totalAmountInvested),
            fill: investmentCategory.color
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
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Investment Portfolio</CardTitle>
        <CardDescription>Your 5 biggest investment categories ({chartSubtitle})</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              formatter={(value, i: string, c: any) => {
                return <div className="flex flex-row gap-2 items-center"><div className = 'w-2 h-2' style={{backgroundColor: c.payload.fill, borderRadius: '0.1rem'}}/>{i.charAt(0).toUpperCase() + i.slice(1) + ": "}<span className="font-bold">{(Number(value)*100).toFixed(2) + '%'}</span></div>;
              }} 
              cursor={false} 
              content={<ChartTooltipContent />} 
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="categoryName"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-lg font-bold"
                        >
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(totalAmountInvested)}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
export default InvestmentDiversificationGraph;