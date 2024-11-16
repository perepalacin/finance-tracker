import { AdminApi } from '@/helpers/Api';
import { ExpenseSortByFields } from '@/helpers/Constants';
import ExpensesTable from '@/tables/ExpensesTable';
import ExpensesTableQueryBuilder from '@/tables/ExpensesTableQueryBuilder';
import { ExpenseProps, QueryParamsProps,  } from '@/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react'

const ExpensesPage = () => {

    const [expenses, setExpenses] = useState<ExpenseProps[]>([]);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [queryParams, setQueryParams] = useState<QueryParamsProps>({
      page: 0,
      pageSize: 20,
      orderBy: ExpenseSortByFields.DATE,
      ascending: false,
      searchInput: "",
    });

    const requestNextPage = () => {
      setQueryParams({...queryParams, page: queryParams.page + 1});
    }

    const updateQueryParams = (newQueryParams: QueryParamsProps): void => {
      newQueryParams.page = 0;
      setQueryParams(newQueryParams);
    }

    useEffect(() => {
      const onSuccessFetchExpenses = (data: ExpenseProps[]) => {
        if (expenses.length === 0 || queryParams.page === 0) {
          setExpenses(data);
        } else {
          const updatedExpenses= [...expenses, ...data];
          setExpenses(updatedExpenses);
        }
        if (data.length !== queryParams.pageSize) {
          setHasNextPage(false);
        }
      }
      const api = new AdminApi();
      api.sendRequest("GET", "/api/v1/expenses?orderBy=" + queryParams.orderBy + "&pageSize=" + queryParams.pageSize + "&page=" + queryParams.page + "&ascending=" + queryParams.ascending + (queryParams.dateRange?.from ? '&fromDate=' + format(queryParams.dateRange.from, 'dd-MM-yyyy') : '') + (queryParams.dateRange?.to ? '&toDate=' + format(queryParams.dateRange.to, 'dd-MM-yyyy') : '') + (queryParams.searchInput ? '&searchInput=' + queryParams.searchInput : ''), {showToast : false, onSuccessFunction: (responseData) => onSuccessFetchExpenses(responseData)});    }, [queryParams]);

  return (
    <>
      <ExpensesTableQueryBuilder dataLabel='expense' queryParams={queryParams} sortByOptions={Object.values(ExpenseSortByFields)} updateQueryParams={updateQueryParams}/>
      <ExpensesTable data={expenses} requestNextPage={requestNextPage} hasNextPage={hasNextPage} />
    </>
  )
}

export default ExpensesPage
