import { AdminApi } from '@/helpers/Api';
import { TransferSortByFields, WindowEvents } from '@/helpers/Constants';
import TableQueryBuilder from '@/tables/TableQueryBuilder';
import TransferTable from '@/tables/TransfersTable';
import { QueryParamsProps, TransferProps } from '@/types';
import { format, parse } from 'date-fns';
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
        case WindowEvents.ADD_TRANSFER: {
          if (transfers.length % 20 !== 0) {
            setTransfers(handleSortingNewTransfer(queryParams, [...transfers, event.detail.data]));
          }
          break;
        }
        case WindowEvents.EDIT_TRANSFER: {
          setTransfers(handleSortingNewTransfer(queryParams, [...transfers.filter((transfer: TransferProps) => transfer.id !== event.detail.data.id), event.detail.data]));
          break;
        }
        case WindowEvents.DELETE_TANSFER: {
          const updatedTransfers = transfers.filter((transfer) => transfer.id !== event.detail.data);
          setTransfers(updatedTransfers);
          break;
        }
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

const handleSortingNewTransfer = (queryParams: QueryParamsProps, transfersArray: TransferProps[]): TransferProps[] => {
  if (queryParams.orderBy === TransferSortByFields.AMOUNT) {
    return transfersArray.sort((a, b) =>
      queryParams.ascending ? a.amount - b.amount : b.amount - a.amount
    );
  } else if (queryParams.orderBy === TransferSortByFields.DATE) {
    return transfersArray.sort((a, b) => {
      const dateA = parse(a.date, 'dd-MM-yyyy', new Date()).getTime();
      const dateB = parse(b.date, 'dd-MM-yyyy', new Date()).getTime();
      return queryParams.ascending ? dateA - dateB : dateB - dateA;
    });
  } else if (queryParams.orderBy === TransferSortByFields.NAME) {
    return transfersArray.sort((a, b) =>
      queryParams.ascending
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }
  return [];
}