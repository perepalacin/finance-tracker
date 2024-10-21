package com.pere_palacin.app.services;

import com.pere_palacin.app.domains.BankAccountDao;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BankAccountService {
    BankAccountDao createAccount(BankAccountDao bankAccountDao);
    List<BankAccountDao> findAll();
    BankAccountDao findById(UUID id);
    BankAccountDao updateAccount(UUID id, BankAccountDao bankAccountDao);
    void addAssociatedExpense(BankAccountDao bankAccountDao, BigDecimal amountSpent);
    void editAssociatedExpense(BankAccountDao bankAccountDao, BigDecimal initialAmount, BigDecimal newAmount);
    void deleteAssociatedExpense(BankAccountDao bankAccountDao, BigDecimal amountToRemove);
    void deleteAccount(UUID id);

}
