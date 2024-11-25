import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AdminApi } from '@/helpers/Api'
import { BANK_ACCOUNTS_EMOJI } from '@/helpers/Constants'
import { InvestmentProps } from '@/types'
import { differenceInCalendarDays, parse } from 'date-fns'
import { useEffect, useState } from 'react'

const InvestmentsAboutToExpireWidget = () => {

    const [investmentsAboutToExpire, setInvestmentsAboutToExpire] = useState<InvestmentProps[]>([]);

    useEffect(() => {
        const onSuccessFetchInvestments = (responseData: InvestmentProps[]) => {
            const sortedData = responseData.sort((a, b) => {
                const dateA = parse(a.endDate, 'dd-MM-yyyy', new Date());
                const dateB = parse(b.endDate, 'dd-MM-yyyy', new Date());
                return differenceInCalendarDays(dateA, dateB);
            });
            setInvestmentsAboutToExpire(sortedData);
        }
        const api = new AdminApi();
        api.sendRequest("GET", "/api/v1/dashboard/investments-to-expire", {onSuccessFunction: onSuccessFetchInvestments})
    }, [])


    console.log(investmentsAboutToExpire);

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Investments about to expire</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-2 '>
                {investmentsAboutToExpire.map((investment: InvestmentProps, index) => {
                    return (
                        <>
                        <article className='flex flex-col items-start gap-2'>
                            <div className='flex flex-row w-full justify-between items-center gap-8'>
                                <h1 className='text-xl font-semibold'>{investment.name}</h1>
                                <p className='text-md'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(investment.amountInvested)}</p>
                            </div>
                            <p><span className='text-muted-foreground text-sm'>Bank account: </span><Badge color='yellow'>{BANK_ACCOUNTS_EMOJI} {investment.bankAccountDto.name}</Badge></p>
                            <div className='flex flex-row gap-1'>{
                                investment.investmentCategoryDtos.map((category) => 
                                    <Badge key={category.id} color={category.color}>{category.investmentCategoryName}</Badge>)}
                            </div>
                            <p className='w-full text-sm text-right'>Ends in {formatEndDate(investment.endDate)}</p>
                        </article>
                        {index !== investmentsAboutToExpire.length -1 &&
                        <Separator />
                        }
                        </>
                    )
                })}
            </CardContent>
        </Card>
    )
}

export default InvestmentsAboutToExpireWidget

function formatEndDate(dateStr: string): string {
    const endDate = parse(dateStr, 'dd-MM-yyyy', new Date());
    const today = new Date();
    const daysDiff = differenceInCalendarDays(endDate, today);
    return daysDiff === 1 ? '1 day' : `${daysDiff} days`;
}