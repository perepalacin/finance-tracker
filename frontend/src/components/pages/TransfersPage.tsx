import TransferTable from '@/tables/TransfersTable';
import { TransferProps } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const TransfersPage = () => {

    const [transfers, setTransfers] = useState<TransferProps[]>([]);

    useEffect(() => {
        const fetchTransfers = () => {
            const token = localStorage.getItem('token');
            axios.get('/api/v1/transfers', {
                headers: {
                    Authorization: token,
                },
            })
            .then(response => {
              if (response.status === 200) {
                setTransfers(response.data);
              }
            })
            .catch(error => {
                console.error(error);
            });
        }
        fetchTransfers();
    }, []);

  return (
    <TransferTable data={transfers} />
  )
}

export default TransfersPage
