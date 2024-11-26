import { AdminApi } from "@/helpers/Api"
import { WindowEvents } from "@/helpers/Constants"
import { BankAccountProps, ExpenseCategoryProps, IncomeExpensesGraphData, IncomeExpensesGraphDto, IncomeSourceProps, IncomeSourcesTopGraphDto, InvestmentCategoriesTopGraphDto, InvestmentCategoryProps } from "@/types"
import { createContext, useContext, useEffect, useState } from "react"

export const shortenedMonthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
];

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
  incomeAndExpensesChartData: IncomeExpensesGraphData[],
  setIncomeAndExpensesChartData: (monthlyData: IncomeExpensesGraphData[]) => void,
  incomeSourcesTopGraph: (IncomeSourcesTopGraphDto[]),
  setIncomeSourcesTopGraph: (data: IncomeSourcesTopGraphDto[]) => void,
  investmentCategoriesTopGraph: (InvestmentCategoriesTopGraphDto[]),
  setInvestmentCategoriesTopGraph: (data: InvestmentCategoriesTopGraphDto[]) => void,
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
  incomeAndExpensesChartData: [],
  setIncomeAndExpensesChartData: () => null,
  incomeSourcesTopGraph: [],
  setIncomeSourcesTopGraph: () => null,
  investmentCategoriesTopGraph: [],
  setInvestmentCategoriesTopGraph: () => null,
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
    const [incomeAndExpensesChartData, setIncomeAndExpensesChartData] = useState<IncomeExpensesGraphData[]>([]);
    const [incomeSourcesTopGraph, setIncomeSourcesTopGraph] = useState<IncomeSourcesTopGraphDto[]>([]);
    const [investmentCategoriesTopGraph, setInvestmentCategoriesTopGraph] = useState<InvestmentCategoriesTopGraphDto[]>([]);

    const onSuccessFetchIncomeExpensesGraph = (data: IncomeExpensesGraphDto[]) => {
      const newChartData: IncomeExpensesGraphData[] = [];
      let previousMonth = -1;
      let previousYear = -1;
      data.forEach((monthlyData: IncomeExpensesGraphDto, index: number) => {
        if (index === 0) {
          newChartData.push({
            income: monthlyData.income,
            expense: monthlyData.expense,
            period: shortenedMonthNames[monthlyData.month-1] + ". " + monthlyData.year
          });
          previousMonth = monthlyData.month;
          previousYear = monthlyData.year;
        } else {
          if (previousYear === monthlyData.year && previousMonth + 1 === monthlyData.month || previousYear + 1 === monthlyData.year && monthlyData.month === 1 && previousMonth === 12) {
            newChartData.push({
              income: monthlyData.income,
              expense: monthlyData.expense,
              period: shortenedMonthNames[monthlyData.month-1] + ". " + monthlyData.year
            });
            previousMonth = monthlyData.month;
            previousYear = monthlyData.year;
          } else {
            let month = previousMonth;
            let year = previousYear;
            while (year < 2100) {
              if (month === 12) {
                year++;
                month = 1;
              } else {
                month++;
              }
              if (month === monthlyData.month && year === monthlyData.year) {
                break;
              } else {
                newChartData.push({
                  income: 0,
                  expense: 0,
                  period: shortenedMonthNames[month-1] + ". " + year
                });
              }
            }
            newChartData.push({
              income: monthlyData.income,
              expense: monthlyData.expense,
              period: shortenedMonthNames[monthlyData.month-1] + ". " + monthlyData.year
            });
            previousMonth = monthlyData.month;
            previousYear = monthlyData.year;
          }
        }
      });
      setIncomeAndExpensesChartData(newChartData);
    }

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
          setBankAccounts((prevAccounts) => prevAccounts.map((account) => {
            if (account.id === event.detail.data.sendingBankAccountDto.id) {
              return event.detail.data.sendingBankAccountDto;
            } else if (account.id === event.detail.data.receivingBankAccountDto.id ) {
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
      api.sendRequest("GET", "/api/v1/dashboard/incomes-expenses-graph", {onSuccessFunction: (responseData) => onSuccessFetchIncomeExpensesGraph(responseData)});
      api.sendRequest("GET", "/api/v1/dashboard/income-sources-graph", {onSuccessFunction: (responseData) => setIncomeSourcesTopGraph(responseData)});
      api.sendRequest("GET", "/api/v1/dashboard/investment-categories-graph", {onSuccessFunction: (responseData) => setInvestmentCategoriesTopGraph(responseData)})

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
    },
    incomeAndExpensesChartData,
    setIncomeAndExpensesChartData: (data: IncomeExpensesGraphData[]) => {
        setIncomeAndExpensesChartData(data);
    },
    incomeSourcesTopGraph,
    setIncomeSourcesTopGraph: (data: IncomeSourcesTopGraphDto[]) => {
        setIncomeSourcesTopGraph(data);
    },
    investmentCategoriesTopGraph,
    setInvestmentCategoriesTopGraph: (data: InvestmentCategoriesTopGraphDto[]) => {
      setInvestmentCategoriesTopGraph(data);
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
