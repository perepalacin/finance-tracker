
export interface publicUserDetailsProps {
    id: string;
    fullname: string;
    username: string;
    profile_picture: string;
}

export interface InvestmentCategoryProps {
    id: string;
    investmentCategoryName: string;
    color: string;
}

export interface InvestmentProps {
    id: string;
    name: string;
    amountInvested: number;
    annotation: string;
    investmentCategoryDtos: InvestmentCategoryProps[];
    bankAccountDto: BankAccountProps;
    startDate: string;
    endDate: string;
}

export interface BankAccountProps {
    id: string;
    name: string;
    currentBalance: number;
    initialAmount: number;
    totalIncome: number;
    totalExpenses: number;
    totalTransferOut: number;
    totalTransferIn: number;
    totalInvested: number;
}

export interface IncomeSourceProps {
    id: string;
    name: string;
    color: string;
}

export interface IncomeProps {
    id: string;
    name: string;
    amount: number;
    annotation: string;
    incomeSourceDto: IncomeSourceProps;
    bankAccountDto: BankAccountProps;
    date: string;
}

export interface ExpenseCategoryProps {
    id: string;
    categoryName: string;
    iconName: string;
}

export interface ExpenseProps {
    id: string;
    name: string;
    amount: number;
    annotation: string;
    expenseCategoryDtos: ExpenseCategoryProps[];
    bankAccountDto: BankAccountProps;
    date: string;
}

export interface TransferProps {
    id: string;
    name: string;
    amount: number;
    annotation: string;
    receivingBankAccountId: string;
    receivingBankAccountDto: BankAccountProps;
    sendingBankAccountId: string;
    sendingBankAccountDto: BankAccountProps;
    date: string;
}

export interface AddButtonsProps {
    isMainLayoutButton: boolean; // prop that controls the sliding animation of the buttons in the main page
    isMainButton: boolean; // prop that controls if they are renfered as a button on the main layout or they are nested inside another component
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"; // Shadcn Variant of the button if it is not a main button
    isOpen?: boolean; // prop that controls if the modal is openned from another component
    setIsOpen?: (isOpen: boolean) => void; // Function that sets the isOpen prop
    renderButton?: boolean; // Option to disable rendering a button to trigger the modal. Very useful if you want to trigger the modal programatically.
}

export interface QueryParamsProps {
    page: number;
    pageSize: number;
    orderBy: string;
    ascending: boolean;
    dateRange?: {from: Date, to: Date};
    searchInput: string;
    searchField: string;
  }