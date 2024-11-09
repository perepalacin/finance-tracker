
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

export interface IncomeSourceProps {
    id: string;
    name: string;
    color: string;
}

export interface AddButtonsProps {
    areOptionsVisible: boolean;
    isMainButton: boolean;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
    renderButton?: boolean;
}