import { AdminApi } from '@/helpers/Api';
import { IncomeSortByFields, WindowEvents } from '@/helpers/Constants';
import IncomesTable from '@/tables/IncomesTable';
import TableQueryBuilder from '@/tables/TableQueryBuilder';
import { IncomeProps, QueryParamsProps } from '@/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react'

const IncomesPage = () => {

  const [incomes, setIncomes] = useState<IncomeProps[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [queryParams, setQueryParams] = useState<QueryParamsProps>({
    page: 0,
    pageSize: 20,
    orderBy: IncomeSortByFields.DATE,
    ascending: false,
    searchInput: "",
  });

  const requestNextPage = () => {
    setQueryParams({...queryParams, page: queryParams.page + 1});
  }

  const updateQueryParams = (newQueryParams: QueryParamsProps): void => {
    newQueryParams.page = 0;
    setHasNextPage(true);
    setQueryParams(newQueryParams);
  }

  useEffect(() => {
    const onSuccessFetchIncomes = (data: IncomeProps[]) => {
      if (incomes.length === 0 || queryParams.page === 0) {
        setIncomes(data);
      } else {
        const updatedIncomes= [...incomes, ...data];
        setIncomes(updatedIncomes);
      }
      if (data.length !== queryParams.pageSize) {
        setHasNextPage(false);
      }
    }
    const api = new AdminApi();
    api.sendRequest("GET", "/api/v1/incomes?orderBy=" + queryParams.orderBy + "&pageSize=" + queryParams.pageSize + "&page=" + queryParams.page + "&ascending=" + queryParams.ascending + (queryParams.dateRange?.from ? '&fromDate=' + format(queryParams.dateRange.from, 'dd-MM-yyyy') : '') + (queryParams.dateRange?.to ? '&toDate=' + format(queryParams.dateRange.to, 'dd-MM-yyyy') : '') + (queryParams.searchInput ? '&searchInput=' + queryParams.searchInput : ''), {showToast : false, onSuccessFunction: (responseData) => onSuccessFetchIncomes(responseData)});
  }, [queryParams]);

  useEffect(() => {
    const handleEditFetchedIncomes = (event: CustomEvent) => {
      if (event.type === WindowEvents.EDIT_BANK_ACCOUNT) {
        const updatedIncomes = incomes.map((income: IncomeProps) => {
          if (income.bankAccountDto.id === event.detail.data.id) {
            income.bankAccountDto = event.detail.data;
            return income;
          } else {
            return income;
          }
        });
        setIncomes(updatedIncomes);
      } else if (event.type === WindowEvents.EDIT_INCOME_SOURCE) {
        const updatedIncomes = incomes.map((income: IncomeProps) => { 
          if (income.incomeSourceDto.id === event.detail.data.id) {
            income.incomeSourceDto = event.detail.data;
            return income;
          } else {
            return income;
          }
        })
        setIncomes(updatedIncomes);
      }
    } 
    
    const handleEvent = (event: Event) => handleEditFetchedIncomes(event as CustomEvent);
    addEventListener(WindowEvents.EDIT_BANK_ACCOUNT, handleEvent);
    addEventListener(WindowEvents.EDIT_INCOME_SOURCE, handleEvent);
    return () => {
      removeEventListener(WindowEvents.EDIT_BANK_ACCOUNT, handleEvent);
      removeEventListener(WindowEvents.EDIT_INCOME_SOURCE, handleEvent);
    }
  }, [incomes]);

  return (
    <>
      <TableQueryBuilder dataLabel='incomes' queryParams={queryParams} sortByOptions={Object.values(IncomeSortByFields)} updateQueryParams={updateQueryParams}/>
      <IncomesTable data={incomes} requestNextPage={requestNextPage} hasNextPage={hasNextPage}/>
    </>
  )
}

export default IncomesPage
