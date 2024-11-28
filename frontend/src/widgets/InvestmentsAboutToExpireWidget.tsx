import AddInvestmentModal from '@/components/modals/AddInvestmentModal'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useUserData } from '@/context/UserDataContext'
import { AdminApi } from '@/helpers/Api'
import { BANK_ACCOUNTS_EMOJI } from '@/helpers/Constants'
import { InvestmentProps } from '@/types'
import { differenceInCalendarDays, parse } from 'date-fns'
import { useEffect, useState } from 'react'

const InvestmentsAboutToExpireWidget = () => {

    const [investmentsAboutToExpire, setInvestmentsAboutToExpire] = useState<InvestmentProps[]>([]);

    const {bankAccounts} = useUserData();

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
    }, [bankAccounts])

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Investments about to expire</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-2 '>
                {investmentsAboutToExpire.length > 0 ? investmentsAboutToExpire.map((investment: InvestmentProps, index) => {
                    return (
                        <>
                        <article key={investment.id} className='flex flex-col items-start gap-2'>
                            <div className='flex flex-row w-full justify-between items-center gap-8'>
                                <h1 className='text-xl font-semibold'>{investment.name}</h1>
                                <p className='text-md'>{new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR"}).format(investment.amountInvested)}</p>
                            </div>
                            <div className='w-full flex flex-row justify-between items-center'>
                            <Badge color='yellow'>{BANK_ACCOUNTS_EMOJI} {investment.bankAccountDto.name}</Badge>
                            <p className='text-sm'>Ends in {formatEndDate(investment.endDate)}</p>
                            </div>
                        </article>
                        {index !== investmentsAboutToExpire.length -1 &&
                        <Separator />
                        }
                        </>
                    )
                }): 
                <div className="w-full flex flex-col items-start justify-start gap-4">
                <p>Nothing to see here...</p>
                <div className="flex flex-row gap-2 w-3/5">
                  <AddInvestmentModal
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

export default InvestmentsAboutToExpireWidget

function formatEndDate(dateStr: string): string {
    const endDate = parse(dateStr, 'dd-MM-yyyy', new Date());
    const today = new Date();
    const daysDiff = differenceInCalendarDays(endDate, today);
    return daysDiff === 1 ? '1 day' : `${daysDiff} days`;
}