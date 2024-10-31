package com.pere_palacin.app.services;



import com.pere_palacin.app.domains.InvestmentDao;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface InvestmentService {
    Page<InvestmentDao> findAll();
    InvestmentDao findById(UUID id);
    InvestmentDao createInvestment(InvestmentDao investmentDao, UUID bankAccountId);
    InvestmentDao updateInvestment(UUID id, InvestmentDao investmentDao, UUID bankAccountId);
    void deleteInvestment(UUID id);
}
