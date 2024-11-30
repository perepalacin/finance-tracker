package com.pere_palacin.app.services;

import com.pere_palacin.app.domains.IncomeDao;
import com.pere_palacin.app.domains.sortBys.IncomeSortBy;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface IncomeService {
    List<IncomeDao> findAllUserIncomes(IncomeSortBy orderBy, int page, int pageSize, boolean ascending, String fromDate, String toDate, String searchInput);
    IncomeDao findById(UUID id);
    IncomeDao registerIncome(IncomeDao incomeDao, UUID incomeSourceId, UUID bankAccountId);
    IncomeDao updateIncome(UUID id, IncomeDao incomeDao, UUID incomeSourceId, UUID bankAccountId);
    void deleteIncome(UUID id);
    void deleteInBatch(Set<UUID> incomesId);
}
