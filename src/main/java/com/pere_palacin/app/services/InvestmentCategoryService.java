package com.pere_palacin.app.services;


import com.pere_palacin.app.domains.InvestmentCategoryDao;
import com.pere_palacin.app.domains.dto.InvestmentCategoriesWithAmountDto;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface InvestmentCategoryService {
    InvestmentCategoryDao createInvestmentCategory(InvestmentCategoryDao investmentCategoryDao);
    List<InvestmentCategoryDao> findAll();
    Set<InvestmentCategoryDao> findAllById(List<UUID> categoriesId);
    InvestmentCategoryDao findById(UUID id);
    InvestmentCategoryDao updateInvestmentCategory(InvestmentCategoryDao investmentCategoryDao, UUID id);
    void deleteInvestmentCategory(UUID id);
}
