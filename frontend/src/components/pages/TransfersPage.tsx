import { AdminApi } from '@/helpers/Api';
import { TransferSortByFields } from '@/helpers/Constants';
import TableQueryBuilder from '@/tables/TableQueryBuilder';
import TransferTable from '@/tables/TransfersTable';
import { QueryParamsProps, TransferProps } from '@/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react'

const TransfersPage = () => {

  const [transfers, setTransfers] = useState<TransferProps[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [queryParams, setQueryParams] = useState<QueryParamsProps>({
    page: 0,
    pageSize: 20,
    orderBy: TransferSortByFields.DATE,
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
    const onSuccessFetchTransfers = (data: TransferProps[]) => {
      if (transfers.length === 0 || queryParams.page === 0) {
        setTransfers(data);
      } else {
        const updatedIncomes= [...transfers, ...data];
        setTransfers(updatedIncomes);
      }
      if (data.length !== queryParams.pageSize) {
        setHasNextPage(false);
      }
    }
    const api = new AdminApi();
    api.sendRequest("GET", "/api/v1/transfers?orderBy=" + queryParams.orderBy + "&pageSize=" + queryParams.pageSize + "&page=" + queryParams.page + "&ascending=" + queryParams.ascending + (queryParams.dateRange?.from ? '&fromDate=' + format(queryParams.dateRange.from, 'dd-MM-yyyy') : '') + (queryParams.dateRange?.to ? '&toDate=' + format(queryParams.dateRange.to, 'dd-MM-yyyy') : '') + (queryParams.searchInput ? '&searchInput=' + queryParams.searchInput : ''), {showToast : false, onSuccessFunction: (responseData) => onSuccessFetchTransfers(responseData)});
  }, [queryParams]);


  return (
    <>
      <TableQueryBuilder dataLabel='transfers' queryParams={queryParams} sortByOptions={Object.values(TransferSortByFields)} updateQueryParams={updateQueryParams}/>
      <TransferTable data={transfers} requestNextPage={requestNextPage} hasNextPage={hasNextPage}/>
    </>
  )
}

export default TransfersPage
