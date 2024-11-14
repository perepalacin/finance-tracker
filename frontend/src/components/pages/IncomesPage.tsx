import { AdminApi } from '@/helpers/Api';
import IncomesTable from '@/tables/IncomesTable';
import { IncomeProps } from '@/types';
import { useEffect, useState } from 'react'

const IncomesPage = () => {

    const [incomes, setIncomes] = useState<IncomeProps[]>([]);

    useEffect(() => {
      const api = new AdminApi();
      api.sendRequest("GET", "/api/v1/incomes", {showToast: false, onSuccessFunction:(data) => setIncomes(data)});
    }, []);

  return (
    <IncomesTable data={incomes} />
  )
}

export default IncomesPage
