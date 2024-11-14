import { AdminApi } from '@/helpers/Api';
import ExpensesTable from '@/tables/ExpensesTable';
import { ExpenseProps } from '@/types';
import { useEffect, useState } from 'react'

const ExpensesPage = () => {

    const [expenses, setExpenses] = useState<ExpenseProps[]>([]);

    useEffect(() => {
        const api = new AdminApi();
        api.sendRequest("GET", "/api/v1/expenses", {showToast : false, onSuccessFunction: (responseDate) =>setExpenses(responseDate)});
    }, []);

  return (
    <ExpensesTable data={expenses} />
  )
}

export default ExpensesPage
