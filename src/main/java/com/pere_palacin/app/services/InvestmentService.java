package com.pere_palacin.app.services;

import com.pere_palacin.app.domains.InvestmentDao;
import com.pere_palacin.app.domains.sortBys.InvestmentSortBy;

import java.util.List;
import java.util.UUID;

public interface InvestmentService {
    List<InvestmentDao> findAll(InvestmentSortBy orderBy, int page, int pageSize, boolean ascending);
    InvestmentDao findById(UUID id);
    InvestmentDao createInvestment(InvestmentDao investmentDao, UUID bankAccountId);
    InvestmentDao updateInvestment(UUID id, InvestmentDao investmentDao, UUID bankAccountId);
    void deleteInvestment(UUID id);
}
