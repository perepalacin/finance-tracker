package com.pere_palacin.app.services;

import com.pere_palacin.app.domains.ExpenseDao;

import java.util.UUID;

public interface ExpenseService {
    ExpenseDao findById(UUID id);
    ExpenseDao registerExpense(ExpenseDao expenseDao, UUID categoryId, UUID bankAccountId);
    ExpenseDao updateExpense(UUID id, ExpenseDao expenseDao, UUID categoryId, UUID bankAccountId);
    void deleteExpense(UUID id);
}
