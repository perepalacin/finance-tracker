package com.pere_palacin.app.services;

import com.pere_palacin.app.domains.IncomeDao;
import com.pere_palacin.app.domains.sortBys.ExpenseSortBy;
import com.pere_palacin.app.domains.sortBys.IncomeSortBy;

import java.util.List;
import java.util.UUID;

public interface IncomeService {
    List<IncomeDao> findAllUserIncomes(IncomeSortBy orderBy, int page, int pageSize, boolean ascending);
    IncomeDao findById(UUID id);
    IncomeDao registerIncome(IncomeDao incomeDao, UUID incomeSourceId, UUID bankAccountId);
    IncomeDao updateIncome(UUID id, IncomeDao incomeDao, UUID incomeSourceId, UUID bankAccountId);
    void deleteIncome(UUID id);
}
