import { AdminApi } from '@/helpers/Api';
import InvestmentsTable from '@/tables/InvestmentsTable';
import { InvestmentProps } from '@/types';
import { useEffect, useState } from 'react'

const InvestmentsPage = () => {

    const [investments, setInvestments] = useState<InvestmentProps[]>([]);

    useEffect(() => {
      const api = new AdminApi();
      api.sendRequest("GET", "/api/v1/investments", {showToast: false, onSuccessFunction:(data) => setInvestments(data)});
    }, []);

  return (
    <InvestmentsTable data={investments} />
  )
}

export default InvestmentsPage
