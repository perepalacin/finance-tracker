package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.IncomeSourceDao;
import com.pere_palacin.app.domains.InvestmentCategoryDao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InvestmentCategoryRepository extends JpaRepository<InvestmentCategoryDao, UUID> {
    List<InvestmentCategoryDao> findByUserId(Integer id);
}