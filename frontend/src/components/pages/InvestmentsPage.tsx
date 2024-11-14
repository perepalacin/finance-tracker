import InvestmentsTable from '@/tables/InvestmentsTable';
import { InvestmentProps } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react'

const InvestmentsPage = () => {

    const [investments, setInvestments] = useState<InvestmentProps[]>([]);

    useEffect(() => {
        const fetchInvestments = () => {
            const token = localStorage.getItem('token');
            axios.get('/api/v1/investments', {
                headers: {
                    Authorization: token,
                },
            })
            .then(response => {
              if (response.status === 200) {
                setInvestments(response.data);
              }
            })
            .catch(error => {
                console.error(error);
            });
        }
        fetchInvestments();
    }, []);

  return (
    <InvestmentsTable data={investments} />
  )
}

export default InvestmentsPage
