package com.pere_palacin.app.services;


import com.pere_palacin.app.domains.InvestmentCategoryDao;

import java.util.List;
import java.util.UUID;

public interface InvestmentCategoryService {
    InvestmentCategoryDao createInvestmentCategory(InvestmentCategoryDao investmentCategoryDao);
    List<InvestmentCategoryDao> findAll();
    InvestmentCategoryDao findById(UUID id);
    InvestmentCategoryDao updateInvestmentCategory(InvestmentCategoryDao investmentCategoryDao, UUID id);
    void deleteInvestmentCategory(UUID id);
}
