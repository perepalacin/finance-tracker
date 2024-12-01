import { AdminApi } from '@/helpers/Api';
import { TransferSortByFields, WindowEvents } from '@/helpers/Constants';
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

  const fetchTransfers = (isRowUpdate = false, page?: number, pageSize?: number) => {
    if (pageSize === undefined) {
      pageSize = queryParams.pageSize;
    }
    if (page === undefined) {
      page = queryParams.page;
    }
    const onSuccessFetchTransfers = (data: TransferProps[]) => {
      if (transfers.length === 0 || page === 0 || isRowUpdate) {
        setTransfers(data);
      } else {
        const updatedTransfers = [...transfers, ...data];
        setTransfers(updatedTransfers);
      }
      if (data.length % 20 !== 0) {
        setHasNextPage(false);
      }
    }
    const api = new AdminApi();
    api.sendRequest("GET", "/api/v1/transfers?orderBy=" + queryParams.orderBy + "&pageSize=" + pageSize + "&page=" + page + "&ascending=" + queryParams.ascending + (queryParams.dateRange?.from ? '&fromDate=' + format(queryParams.dateRange.from, 'dd-MM-yyyy') : '') + (queryParams.dateRange?.to ? '&toDate=' + format(queryParams.dateRange.to, 'dd-MM-yyyy') : '') + (queryParams.searchInput ? '&searchInput=' + queryParams.searchInput : ''), {showToast : false, onSuccessFunction: (responseData) => onSuccessFetchTransfers(responseData)});
  }

  useEffect(() => {
    fetchTransfers();
  }, [queryParams]);

  useEffect(() => {
    const handleEditFetchedTransfers = (event: CustomEvent) => {
      switch (event.type) {
        case WindowEvents.EDIT_BANK_ACCOUNT: {
          const updatedTransfers = transfers.map((transfer: TransferProps) => {
            if (transfer.sendingBankAccountDto.id === event.detail.data.id) {
              transfer.sendingBankAccountDto = event.detail.data;
            } else if (transfer.receivingBankAccountDto.id === event.detail.data.id) {
              transfer.receivingBankAccountDto = event.detail.data;
            }
            return transfer;
          });
          setTransfers(updatedTransfers);
          break;
        }
        case WindowEvents.ADD_TRANSFER:
        case WindowEvents.EDIT_TRANSFER:
        case WindowEvents.DELETE_TANSFER:
          fetchTransfers(true, 0, (queryParams.page+1)*queryParams.pageSize);
          break;
      }
    } 
    
    const handleEvent = (event: Event) => handleEditFetchedTransfers(event as CustomEvent);
    addEventListener(WindowEvents.EDIT_BANK_ACCOUNT, handleEvent);
    addEventListener(WindowEvents.ADD_TRANSFER, handleEvent);
    addEventListener(WindowEvents.EDIT_TRANSFER, handleEvent);
    addEventListener(WindowEvents.DELETE_TANSFER, handleEvent);

    return () => {
      removeEventListener(WindowEvents.EDIT_BANK_ACCOUNT, handleEvent);
      removeEventListener(WindowEvents.ADD_TRANSFER, handleEvent);
      removeEventListener(WindowEvents.EDIT_TRANSFER, handleEvent);
      removeEventListener(WindowEvents.DELETE_TANSFER, handleEvent);

    }
  }, [transfers]);


  return (
    <>
      <TableQueryBuilder dataLabel='transfers' queryParams={queryParams} sortByOptions={Object.values(TransferSortByFields)} updateQueryParams={updateQueryParams}/>
      <TransferTable data={transfers} requestNextPage={requestNextPage} hasNextPage={hasNextPage}/>
    </>
  )
}

export default TransfersPage
