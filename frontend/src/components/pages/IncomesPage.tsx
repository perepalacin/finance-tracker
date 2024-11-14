import IncomesTable from '@/tables/IncomesTable';
import { IncomeProps } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react'

const IncomesPage = () => {

    const [incomes, setIncomes] = useState<IncomeProps[]>([]);

    useEffect(() => {
        const fetchIncomes = () => {
            const token = localStorage.getItem('token');
            axios.get('/api/v1/incomes', {
                headers: {
                    Authorization: token,
                },
            })
            .then(response => {
              if (response.status === 200) {
                setIncomes(response.data);
              }
            })
            .catch(error => {
                console.error(error);
            });
        }
        fetchIncomes();
    }, []);

  return (
    <IncomesTable data={incomes} />
  )
}

export default IncomesPage
