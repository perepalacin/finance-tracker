import { AdminApi } from '@/helpers/Api';
import TransferTable from '@/tables/TransfersTable';
import { TransferProps } from '@/types';
import { useEffect, useState } from 'react'

const TransfersPage = () => {

    const [transfers, setTransfers] = useState<TransferProps[]>([]);

    useEffect(() => {
      const api = new AdminApi();
      api.sendRequest("GET", "/api/v1/transfers", {showToast: false, onSuccessFunction:(data) => setTransfers(data)});
    }, []);

  return (
    <TransferTable data={transfers} />
  )
}

export default TransfersPage
