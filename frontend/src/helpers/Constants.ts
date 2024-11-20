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

export enum WindowEvents {
    ADD_BANK_ACCOUNT = "addBankAccount",
    EDIT_BANK_ACCOUNT = "editBankAccount",
    ADD_EXPENSE_CATEGORY = "addExpenseCategory",
    EDIT_EXPENSE_CATEGORY = "editExpenseCategory",
    ADD_INCOME_SOURCE = "addIncomeSource",
    EDIT_INCOME_SOURCE = "editIncomeSource",
    ADD_INVESTMENT_CATEGORY = "addInvestmentCategory",
    EDIT_INVESTMENT_CATEGORY = "editInvestmentCategory",
    ADD_TRANSFER = "addTransfer",
    EDIT_TRANSFER = "editTransfer",
    DELETE_TANSFER = "deleteTransfer",
    ADD_INCOME = "addIncome",
    EDIT_INCOME = "editIncome",
    DELETE_INCOME = "deleteIncome",
    ADD_EXPENSE = "addExpense",
    EDIT_EXPENSE = "editExpense",
    DELETE_EXPENSE = "deleteExpense",
    ADD_INVESTMENT = "addInvestment",
    EDIT_INVESTMENT = "editInvestment",
    DELETE_INVESTMENT = "deleteInvestment"
}