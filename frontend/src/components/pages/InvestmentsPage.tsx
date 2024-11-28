import { AdminApi } from '@/helpers/Api';
import { InvestmentSortByFields, WindowEvents } from '@/helpers/Constants';
import InvestmentsTable from '@/tables/InvestmentsTable';
import TableQueryBuilder from '@/tables/TableQueryBuilder';
import { InvestmentProps, QueryParamsProps } from '@/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react'

const InvestmentsPage = () => {

  const [investments, setInvestments] = useState<InvestmentProps[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [queryParams, setQueryParams] = useState<QueryParamsProps>({
    page: 0,
    pageSize: 20,
    orderBy: InvestmentSortByFields.START_DATE,
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

  const fetchInvestments = (isRowUpdate = false, page?: number, pageSize?: number) => {
    if (page === undefined) {
      page = queryParams.page;
    }
    if (pageSize === undefined) {
      pageSize = queryParams.pageSize;
    }

    const onSuccessFetchInvestments = (data: InvestmentProps[]) => {
      if (investments.length === 0 || queryParams.page === 0 || isRowUpdate) {
        setInvestments(data);
      } else {
        const updatedIncomes= [...investments, ...data];
        setInvestments(updatedIncomes);
      }
      if (data.length % 20 !== 0) {
        setHasNextPage(false);
      }
    }
    const api = new AdminApi();
    api.sendRequest("GET", "/api/v1/investments?orderBy=" + queryParams.orderBy + "&pageSize=" + pageSize + "&page=" + page + "&ascending=" + queryParams.ascending + (queryParams.dateRange?.from ? '&fromDate=' + format(queryParams.dateRange.from, 'dd-MM-yyyy') : '') + (queryParams.dateRange?.to ? '&toDate=' + format(queryParams.dateRange.to, 'dd-MM-yyyy') : '') + (queryParams.searchInput ? '&searchInput=' + queryParams.searchInput : ''), {showToast : false, onSuccessFunction: (responseData) => onSuccessFetchInvestments(responseData)});
  }

  useEffect(() => {
    fetchInvestments();
  }, [queryParams]);

  useEffect(() => {
    const handleEditFetchedInvestments = (event: CustomEvent) => {
      switch (event.type) {
        case WindowEvents.EDIT_BANK_ACCOUNT: {
          const updatedInvestments = investments.map((investment: InvestmentProps) => {
            if (investment.bankAccountDto.id === event.detail.data.id) {
              investment.bankAccountDto = event.detail.data;
              return investment;
            } else {
              return investment;
            }
          });
          setInvestments(updatedInvestments);
          break;
        }
        case (WindowEvents.EDIT_INVESTMENT_CATEGORY): {
          const updatedInvestments = investments.map((investment: InvestmentProps) => {
            investment.investmentCategoryDtos = investment.investmentCategoryDtos.map((category) => {
              if (category.id === event.detail.data.id) {
                return event.detail.data;
              } else {
                return category;
              }
            });
            return investment;
          });
          setInvestments(updatedInvestments);
          break;
        }
        case WindowEvents.ADD_INVESTMENT: 
        case WindowEvents.EDIT_INVESTMENT: 
        case WindowEvents.DELETE_INVESTMENT: 
          fetchInvestments(true, 0, (queryParams.page+1)*queryParams.pageSize);
          break;
      }
    } 
    
    const handleEvent = (event: Event) => handleEditFetchedInvestments(event as CustomEvent);
    addEventListener(WindowEvents.EDIT_BANK_ACCOUNT, handleEvent);
    addEventListener(WindowEvents.EDIT_INVESTMENT_CATEGORY, handleEvent);
    addEventListener(WindowEvents.ADD_INVESTMENT, handleEvent);
    addEventListener(WindowEvents.EDIT_INVESTMENT, handleEvent);
    addEventListener(WindowEvents.DELETE_INVESTMENT, handleEvent);
    return () => {
      removeEventListener(WindowEvents.EDIT_BANK_ACCOUNT, handleEvent);
      removeEventListener(WindowEvents.EDIT_INVESTMENT_CATEGORY, handleEvent);
      removeEventListener(WindowEvents.ADD_INVESTMENT, handleEvent);
      removeEventListener(WindowEvents.EDIT_INVESTMENT, handleEvent);
      removeEventListener(WindowEvents.DELETE_INVESTMENT, handleEvent);
    }
  }, [investments]);


  return (
    <>
      <TableQueryBuilder dataLabel='investments' queryParams={queryParams} sortByOptions={Object.values(InvestmentSortByFields)} updateQueryParams={updateQueryParams}/>
      <InvestmentsTable data={investments} requestNextPage={requestNextPage} hasNextPage={hasNextPage}/>
    </>
  )
}

export default InvestmentsPage
