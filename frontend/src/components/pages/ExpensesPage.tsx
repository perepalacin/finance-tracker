import ExpensesTable from '@/tables/ExpensesTable';
import { ExpenseProps } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react'

const ExpensesPage = () => {

    const [expenses, setExpenses] = useState<ExpenseProps[]>([]);

    useEffect(() => {
        const fetchIncomes = () => {
            const token = localStorage.getItem('token');
            axios.get('/api/v1/expenses', {
                headers: {
                    Authorization: token,
                },
            })
            .then(response => {
              if (response.status === 200) {
                setExpenses(response.data);
              }
            })
            .catch(error => {
                console.error(error);
            });
        }
        fetchIncomes();
    }, []);

  return (
    <ExpensesTable data={expenses} />
  )
}

export default ExpensesPage
