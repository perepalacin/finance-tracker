package com.pere_palacin.app.services;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.pere_palacin.app.domains.ExpenseDao;
import com.pere_palacin.app.domains.sortBys.ExpenseSortBy;

public interface ExpenseService {
    List<ExpenseDao> findAll(ExpenseSortBy orderBy, int page, int pageSize, boolean ascending, String fromDate, String toDate, String searchInput);
    ExpenseDao findById(UUID id);
    ExpenseDao registerExpense(ExpenseDao expenseDao, UUID bankAccountId);
    ExpenseDao updateExpense(UUID id, ExpenseDao expenseDao, UUID bankAccountId);
    void deleteExpense(UUID id);
    void deleteInBatch(Set<UUID> expensesId);
}
