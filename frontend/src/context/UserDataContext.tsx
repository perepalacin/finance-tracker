import { BankAccountProps, ExpenseCategoryProps, IncomeSourceProps, InvestmentCategoryProps } from "@/types"
import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"


type UserDataProviderProps = {
  children: React.ReactNode
}

type UserDataProviderState = {
  investmentCategories: InvestmentCategoryProps[];
  setInvestmentCategories: (categories: InvestmentCategoryProps[]) => void;
  bankAccounts: BankAccountProps[];
  setBankAccounts: (bankAccounts: BankAccountProps[]) => void;
  incomeSources: IncomeSourceProps[],
  setIncomeSources: (incomeSources: IncomeSourceProps[]) => void;
  expenseCategories: ExpenseCategoryProps[],
  setExpenseCategories: (categories: ExpenseCategoryProps[]) => void;
}

const initialState: UserDataProviderState = {
  investmentCategories: [],
  setInvestmentCategories: () => null,
  bankAccounts: [],
  setBankAccounts: () => null,
  incomeSources: [],
  setIncomeSources: () => null,
  expenseCategories: [],
  setExpenseCategories: () => null,
}

const UserDataProviderContext = createContext<UserDataProviderState>(initialState)

export function UserDataProvider({
  children,
  ...props
}: UserDataProviderProps) {


    const [investmentCategories, setInvestmentCategories] = useState<InvestmentCategoryProps[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccountProps[]>([]);
    const [incomeSources, setIncomeSources] = useState<IncomeSourceProps[]>([]);
    const [expenseCategories, setExpenseCategories] = useState<ExpenseCategoryProps[]>([]);


    const fetchInvestmentCategories = (token: string) => {
        axios.get('/api/v1/investment-categories', {
            headers: {
                Authorization: token,
            },
        })
        .then(response => {
          if (response.status === 200) {
            setInvestmentCategories(response.data);
          }
        })
        .catch(error => {
            console.error(error);
        });
    }

    const fetchBankAccounts = (token: string) => {
        axios.get('/api/v1/accounts', {
            headers: {
                Authorization: token,
            },
        })
        .then(response => {
          if (response.status === 200) {
            setBankAccounts(response.data);
          }
        })
        .catch(error => {
            console.error(error);
        });
    }

    const fetchIncomeSources = (token: string) => {
        axios.get('/api/v1/sources', {
            headers: {
                Authorization: token,
            },
        })
        .then(response => {
          if (response.status === 200) {
            setIncomeSources(response.data);
          }
        })
        .catch(error => {
            console.error(error);
        });
    }

    const fetchExpenseCategories = (token: string) => {
        axios.get('/api/v1/categories', {
            headers: {
                Authorization: token,
            },
        })
        .then(response => {
          if (response.status === 200) {
            setExpenseCategories(response.data);
          }
        })
        .catch(error => {
            console.error(error);
        });
    }
    
      useEffect(() => {
          const token = localStorage.getItem('token');
            if (token) {
              fetchInvestmentCategories(token);
              fetchBankAccounts(token);
              fetchIncomeSources(token);
              fetchExpenseCategories(token);
            } else {
                //TODO: go back to sign in page
            }
      }, []);

  const value = {
    investmentCategories,
    setInvestmentCategories: (categories: InvestmentCategoryProps[]) => {
      setInvestmentCategories(categories);
    },
    bankAccounts,
    setBankAccounts: (accounts: BankAccountProps[]) => {
        setBankAccounts(accounts);
    },
    incomeSources,
    setIncomeSources: (sources: IncomeSourceProps[]) => {
        setIncomeSources(sources);
    },
    expenseCategories,
    setExpenseCategories: (categories: ExpenseCategoryProps[]) => {
        setExpenseCategories(categories);
    } 
  }

  return (
    <UserDataProviderContext.Provider {...props} value={value}>
      {children}
    </UserDataProviderContext.Provider>
  )
}

export const useUserData = () => {
  const context = useContext(UserDataProviderContext)

  if (context === undefined)
    throw new Error("useUserData must be used within a UserDataContext")

  return context
}
