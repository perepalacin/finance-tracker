package com.pere_palacin.app.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.pere_palacin.app.domains.dto.IncomeAndExpensesChartDto;
import com.pere_palacin.app.domains.dto.IncomeSourceWithAmountDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.pere_palacin.app.domains.IncomeDao;
import com.pere_palacin.app.domains.dto.MonthlyIncome;

@Repository
public interface IncomeRepository extends JpaRepository<IncomeDao, UUID> {
    Page<IncomeDao> findAllByUserId(UUID userId, Pageable pageable);
    Page<IncomeDao> findAllByUserIdAndAnnotationContainingIgnoreCaseOrNameContainingIgnoreCase(UUID userId, String annotation, String name, Pageable pageable);
    Page<IncomeDao> findAllByUserIdAndDateAfterAndDateBefore(UUID userId, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    Page<IncomeDao> findAllByUserIdAndAnnotationContainingIgnoreCaseOrNameContainingIgnoreCaseAndDateAfterAndDateBefore(UUID userId, String annotation, String name, LocalDate fromDate, LocalDate toDate, Pageable pageable);

    @Query("SELECT new com.pere_palacin.app.domains.dto.MonthlyIncome(SUM(i.amount), MONTH(i.date), YEAR(i.date)) " +
            "FROM IncomeDao i WHERE i.user.id = :userId " +
            "GROUP BY YEAR(i.date), MONTH(i.date) " +
            "ORDER BY YEAR(i.date), MONTH(i.date)")
    List<MonthlyIncome> findMonthlyIncomeSummedByUserId(UUID userId);

    @Query("SELECT new com.pere_palacin.app.domains.dto.IncomeSourceWithAmountDto(i.incomeSourceDao.id, SUM(i.amount)) " +
            "FROM IncomeDao i WHERE i.user.id = :userId " +
            "GROUP BY i.incomeSourceDao.id")
    List<IncomeSourceWithAmountDto> findIncomesByCategories(UUID userId);
    void deleteByIdInAndUserId(List<UUID> ids, UUID userId);
}
