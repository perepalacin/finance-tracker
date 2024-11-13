package com.pere_palacin.app.services;

import com.pere_palacin.app.domains.BankAccountDao;
import com.pere_palacin.app.domains.ExpenseDao;
import com.pere_palacin.app.domains.TransferDao;
import com.pere_palacin.app.domains.sortBys.BankAccountSortBy;
import com.pere_palacin.app.domains.sortBys.ExpenseSortBy;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BankAccountService {
    BankAccountDao createAccount(BankAccountDao bankAccountDao);
    List<BankAccountDao> findAll(BankAccountSortBy orderBy, int page, int pageSize, boolean ascending);
    BankAccountDao findById(UUID id);
    BankAccountDao updateAccount(UUID id, BankAccountDao bankAccountDao);
    void addAssociatedExpense(BankAccountDao bankAccountDao, BigDecimal amountSpent);
    void editAssociatedExpense(BankAccountDao bankAccountDao, BigDecimal initialAmount, BigDecimal newAmount);
    void deleteAssociatedExpense(BankAccountDao bankAccountDao, BigDecimal amountToRemove);
    void addAssociatedIncome(BankAccountDao bankAccountDao, BigDecimal incomeAmount);
    void editAssociatedIncome(BankAccountDao bankAccountDao, BigDecimal initialIncome, BigDecimal newIncome);
    void deleteAssociatedIncome(BankAccountDao bankAccountDao, BigDecimal amountToRemove);
    void deleteAccount(UUID id);
    void createTransfer(BankAccountDao receivingBankAccount, BankAccountDao sendingBankAccount, BigDecimal amount);
    void editTransferAmount(BankAccountDao bankAccountDao, BigDecimal oldAmount, BigDecimal newAmount, boolean isTransferOut);
    void changeReceivingTransferAccount(BankAccountDao oldReceivingAccount, BankAccountDao newReceivingAccount, BigDecimal amount);
    void changeSendingReceivingTransferAccount(BankAccountDao oldSendingAccount, BankAccountDao newSendingAccount, BigDecimal amount);
    void deleteTransfer(BankAccountDao receivingBankAccount, BankAccountDao sendingBankAccount, BigDecimal amount);
    BankAccountDao addInvestment(BankAccountDao bankAccountDao, BigDecimal investedAmount);
    BankAccountDao updateInvestedAmount(BankAccountDao bankAccountDao, BigDecimal newAmount, BigDecimal oldAmount);
    void deleteInvestedAmount(BankAccountDao bankAccountDao, BigDecimal amount);
}
