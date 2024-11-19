import { AdminApi } from '@/helpers/Api';
import { ExpenseSortByFields, WindowEvents } from '@/helpers/Constants';
import ExpensesTable from '@/tables/ExpensesTable';
import TableQueryBuilder from '@/tables/TableQueryBuilder';
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
      setHasNextPage(true);
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
      api.sendRequest("GET", "/api/v1/expenses?orderBy=" + queryParams.orderBy + "&pageSize=" + queryParams.pageSize + "&page=" + queryParams.page + "&ascending=" + queryParams.ascending + (queryParams.dateRange?.from ? '&fromDate=' + format(queryParams.dateRange.from, 'dd-MM-yyyy') : '') + (queryParams.dateRange?.to ? '&toDate=' + format(queryParams.dateRange.to, 'dd-MM-yyyy') : '') + (queryParams.searchInput ? '&searchInput=' + queryParams.searchInput : ''), {showToast : false, onSuccessFunction: (responseData) => onSuccessFetchExpenses(responseData)});
    }, [queryParams]);


    useEffect(() => {
      const handleEditFetchedExpenses = (event: CustomEvent) => {
        if (event.type === WindowEvents.EDIT_BANK_ACCOUNT) {
          const updatedExpenses = expenses.map((expense: ExpenseProps) => {
            if (expense.bankAccountDto.id === event.detail.data.id) {
              expense.bankAccountDto = event.detail.data;
              return expense;
            } else {
              return expense;
            }
          });
          setExpenses(updatedExpenses);
        } else if (event.type === WindowEvents.EDIT_EXPENSE_CATEGORY) {
          const updatedExpenses = expenses.map((expense: ExpenseProps) => {
            expense.expenseCategoryDtos = expense.expenseCategoryDtos.map((category) => {
              if (category.id === event.detail.data.id) {
                return event.detail.data;
              } else {
                return category;
              }
            });
            return expense;
          });
          setExpenses(updatedExpenses);
        }
      } 
      
      const handleEvent = (event: Event) => handleEditFetchedExpenses(event as CustomEvent);
      addEventListener(WindowEvents.EDIT_BANK_ACCOUNT, handleEvent);
      addEventListener(WindowEvents.EDIT_EXPENSE_CATEGORY, handleEvent);
      return () => {
        removeEventListener(WindowEvents.EDIT_BANK_ACCOUNT, handleEvent);
        removeEventListener(WindowEvents.EDIT_EXPENSE_CATEGORY, handleEvent);
      }
    }, [expenses]);

  return (
    <>
      <TableQueryBuilder dataLabel='expense' queryParams={queryParams} sortByOptions={Object.values(ExpenseSortByFields)} updateQueryParams={updateQueryParams}/>
      <ExpensesTable data={expenses} requestNextPage={requestNextPage} hasNextPage={hasNextPage} />
    </>
  )
}

export default ExpensesPage
