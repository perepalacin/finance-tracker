export const BANK_ACCOUNTS_EMOJI = String.fromCodePoint(0x1F3E6);
export const TRANSFERS_EMOJI = String.fromCodePoint(0x1F4E8);
export const INVESTMENTS_EMOJI = String.fromCodePoint(0x1F4C8);
export const INCOMES_EMOJI = String.fromCodePoint(0x1F4B0);
export const EXPENSES_EMOJI = String.fromCodePoint(0x1F4B8); 
export const OPERATIONS_EMOJI = String.fromCodePoint(0x1F9EE);

export enum ExpenseSortByFields {
    NAME = "name",
    AMOUNT = "amount",
    DATE = "date"
};

export enum IncomeSortByFields {
    NAME = "name",
    AMOUNT = "amount",
    DATE = "date"
};

export enum TransferSortByFields {
    NAME = "name",
    AMOUNT = "amount",
    DATE = "date"
};

export enum InvestmentSortByFields {
    NAME = "name",
    AMOUNT = "amount",
    START_DATE = "startDate",
    END_DATE = "endDate"
};