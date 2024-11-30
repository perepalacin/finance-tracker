package com.pere_palacin.app.services;

import com.pere_palacin.app.domains.InvestmentDao;
import com.pere_palacin.app.domains.sortBys.InvestmentSortBy;
import com.pere_palacin.app.exceptions.ImproperInvestmentDatesExpection;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface InvestmentService {
    List<InvestmentDao> findAll(InvestmentSortBy orderBy, int page, int pageSize, boolean ascending, String fromDate, String toDate, String searchInput);
    InvestmentDao findById(UUID id);
    InvestmentDao createInvestment(InvestmentDao investmentDao, UUID bankAccountId);
    InvestmentDao updateInvestment(UUID id, InvestmentDao investmentDao, UUID bankAccountId);
    void deleteInvestment(UUID id);
    void verifyInvestmentDates(LocalDate startDate, LocalDate endDate) throws ImproperInvestmentDatesExpection;
    void deleteInBatch(Set<UUID> investmentsId);

}
