import { AdminApi } from "@/helpers/Api"
import { WindowEvents } from "@/helpers/Constants"
import { BankAccountProps, ExpenseCategoryProps, IncomeSourceProps, InvestmentCategoryProps } from "@/types"
import { debug } from "console"
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
    
    const handleEventsThatEditBankAccounts = (event: CustomEvent) => {
      switch (event.type) {
        case WindowEvents.ADD_EXPENSE:
        case WindowEvents.EDIT_EXPENSE:
        case WindowEvents.ADD_INCOME:
        case WindowEvents.EDIT_INCOME:
        case WindowEvents.ADD_INVESTMENT:
        case WindowEvents.EDIT_INVESTMENT:{
          setBankAccounts((prevAccounts) => prevAccounts.map((account) => {
            if (account.id === event.detail.data.bankAccountDto.id) {
              return event.detail.data.bankAccountDto;
            } else {
              return account;
            }
          }));
          break;
        }
        case WindowEvents.ADD_TRANSFER:
        case WindowEvents.EDIT_TRANSFER: {
          console.log(event.detail.data);
          setBankAccounts((prevAccounts) => prevAccounts.map((account) => {
            if (account.id === event.detail.data.sendingBankAccountDto.id) {
              console.log(event.detail.data.sendingBankAccountDto);
              return event.detail.data.sendingBankAccountDto;
            } else if (account.id === event.detail.data.receivingBankAccountDto.id ) {
              console.log(event.detail.data.receivingBankAccountDto);
              return event.detail.data.receivingBankAccountDto;
            } else {
              return account;
            }
          }));
          break;
        }
      }
    }

    useEffect(() => {
      const api = new AdminApi();
      api.sendRequest("GET", "/api/v1/accounts", {showToast : false, onSuccessFunction: (responseData) =>setBankAccounts(responseData)});
      api.sendRequest("GET", "/api/v1/categories", {showToast : false, onSuccessFunction: (responseData) =>setExpenseCategories(responseData)});
      api.sendRequest("GET", "/api/v1/sources", {showToast : false, onSuccessFunction: (responseData) =>setIncomeSources(responseData)});
      api.sendRequest("GET", "/api/v1/investment-categories", {showToast : false, onSuccessFunction: (responseData) =>setInvestmentCategories(responseData)});
      
      const handleEvent = (event: Event) => handleEventsThatEditBankAccounts(event as CustomEvent);
      addEventListener(WindowEvents.ADD_EXPENSE, handleEvent);
      addEventListener(WindowEvents.EDIT_EXPENSE, handleEvent);
      addEventListener(WindowEvents.DELETE_EXPENSE, handleEvent);
      addEventListener(WindowEvents.ADD_INCOME, handleEvent);
      addEventListener(WindowEvents.EDIT_INCOME, handleEvent);
      addEventListener(WindowEvents.DELETE_INCOME, handleEvent);
      addEventListener(WindowEvents.ADD_TRANSFER, handleEvent);
      addEventListener(WindowEvents.EDIT_TRANSFER, handleEvent);
      addEventListener(WindowEvents.DELETE_TANSFER, handleEvent);
      addEventListener(WindowEvents.ADD_INVESTMENT, handleEvent);
      addEventListener(WindowEvents.EDIT_INVESTMENT, handleEvent);
      addEventListener(WindowEvents.DELETE_INVESTMENT, handleEvent);
      return () => {
        removeEventListener(WindowEvents.ADD_EXPENSE, handleEvent);
        removeEventListener(WindowEvents.EDIT_EXPENSE, handleEvent);
        removeEventListener(WindowEvents.DELETE_EXPENSE, handleEvent);
        removeEventListener(WindowEvents.ADD_INCOME, handleEvent);
        removeEventListener(WindowEvents.EDIT_INCOME, handleEvent);
        removeEventListener(WindowEvents.DELETE_INCOME, handleEvent);
        removeEventListener(WindowEvents.ADD_TRANSFER, handleEvent);
        removeEventListener(WindowEvents.EDIT_TRANSFER, handleEvent);
        removeEventListener(WindowEvents.DELETE_TANSFER, handleEvent);
        removeEventListener(WindowEvents.ADD_INVESTMENT, handleEvent);
        removeEventListener(WindowEvents.EDIT_INVESTMENT, handleEvent);
        removeEventListener(WindowEvents.DELETE_INVESTMENT, handleEvent);
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
