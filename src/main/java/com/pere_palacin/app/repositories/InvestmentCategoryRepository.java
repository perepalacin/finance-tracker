package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.IncomeSourceDao;
import com.pere_palacin.app.domains.InvestmentCategoryDao;
import com.pere_palacin.app.domains.dto.InvestmentCategoriesWithAmountDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InvestmentCategoryRepository extends JpaRepository<InvestmentCategoryDao, UUID> {
    List<InvestmentCategoryDao> findByUserId(UUID id);
    @Query("SELECT new com.pere_palacin.app.domains.dto.InvestmentCategoriesWithAmountDto(i.id, SUM(inv.amountInvested)) " +
            "FROM InvestmentCategoryDao i JOIN i.investmentAssociated inv WHERE i.user.id = :userId " +
            "GROUP BY i.id")
    List<InvestmentCategoriesWithAmountDto> findInvestmentsByCategories(UUID userId);
}
