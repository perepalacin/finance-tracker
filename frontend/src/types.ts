
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