import { BankAccountProps, InvestmentCategoryProps } from "@/types"
import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"
import { redirect, useNavigate } from "react-router-dom"


type UserDataProviderProps = {
  children: React.ReactNode
}

type UserDataProviderState = {
  investmentCategories: InvestmentCategoryProps[];
  setInvestmentCategories: (categories: InvestmentCategoryProps[]) => void;
  bankAccounts: BankAccountProps[];
  setBankAccounts: (bankAccounds: BankAccountProps[]) => void;
}

const initialState: UserDataProviderState = {
  investmentCategories: [],
  setInvestmentCategories: () => null,
  bankAccounts: [],
  setBankAccounts: () => null,
}

const UserDataProviderContext = createContext<UserDataProviderState>(initialState)

export function UserDataProvider({
  children,
  ...props
}: UserDataProviderProps) {


    const [investmentCategories, setInvestmentCategories] = useState<InvestmentCategoryProps[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccountProps[]>([]);


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
    
      useEffect(() => {
          const token = localStorage.getItem('token');
            if (token) {
              fetchInvestmentCategories(token);
              fetchBankAccounts(token);
            } else {
                //TODO: go back to sign in page
            }
      }, []);
    

  const value = {
    investmentCategories,
    setInvestmentCategories: (categories: InvestmentCategoryProps[]) => {
      setInvestmentCategories(categories)
    },
    bankAccounts,
    setBankAccounts: (accounts: BankAccountProps[]) => {
        setBankAccounts(accounts)
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
