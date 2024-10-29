package com.pere_palacin.app.services;

import com.pere_palacin.app.domains.ExpenseDao;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface ExpenseService {
    Page<ExpenseDao> findAll();
    ExpenseDao findById(UUID id);
    ExpenseDao registerExpense(ExpenseDao expenseDao, UUID bankAccountId);
    ExpenseDao updateExpense(UUID id, ExpenseDao expenseDao, UUID categoryId, UUID bankAccountId);
    void deleteExpense(UUID id);
}
