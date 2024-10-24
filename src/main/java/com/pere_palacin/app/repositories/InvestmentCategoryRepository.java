package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.IncomeSourceDao;
import com.pere_palacin.app.domains.InvestmentCategoryDao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InvestmentCategoryRepository extends JpaRepository<InvestmentCategoryDao, UUID> {
    List<InvestmentCategoryDao> findByUserId(Integer id);
}
