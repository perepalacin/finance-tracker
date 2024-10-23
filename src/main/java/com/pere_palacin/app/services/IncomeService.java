package com.pere_palacin.app.services;

import com.pere_palacin.app.domains.ExpenseDao;
import com.pere_palacin.app.domains.IncomeDao;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface IncomeService {
    Page<IncomeDao> findAllUserIncomes();
    IncomeDao findById(UUID id);
    IncomeDao registerIncome(IncomeDao incomeDao, UUID incomeSourceId, UUID bankAccountId);
    IncomeDao updateIncome(UUID id, IncomeDao incomeDao, UUID incomeSourceId, UUID bankAccountId);
    void deleteIncome(UUID id);
}
