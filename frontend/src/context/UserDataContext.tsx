import { AdminApi } from "@/helpers/Api"
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
    
    useEffect(() => {
      const api = new AdminApi();
      api.sendRequest("GET", "/api/v1/accounts", {showToast : false, onSuccessFunction: (responseData) =>setBankAccounts(responseData)});
      api.sendRequest("GET", "/api/v1/categories", {showToast : false, onSuccessFunction: (responseData) =>setExpenseCategories(responseData)});
      api.sendRequest("GET", "/api/v1/sources", {showToast : false, onSuccessFunction: (responseData) =>setIncomeSources(responseData)});
      api.sendRequest("GET", "/api/v1/investment-categories", {showToast : false, onSuccessFunction: (responseData) =>setInvestmentCategories(responseData)});
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
