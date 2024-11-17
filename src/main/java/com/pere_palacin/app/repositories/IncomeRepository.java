package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.ExpenseDao;
import com.pere_palacin.app.domains.IncomeDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface IncomeRepository extends JpaRepository<IncomeDao, UUID> {
    Page<IncomeDao> findAllByUserId(UUID userId, Pageable pageable);
    Page<IncomeDao> findAllByUserIdAndAnnotationContainingIgnoreCaseOrNameContainingIgnoreCase(UUID userId, String annotation, String name, Pageable pageable);
    Page<IncomeDao> findAllByUserIdAndDateAfterAndDateBefore(UUID userId, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    Page<IncomeDao> findAllByUserIdAndAnnotationContainingIgnoreCaseOrNameContainingIgnoreCaseAndDateAfterAndDateBefore(UUID userId, String annotation, String name, LocalDate fromDate, LocalDate toDate, Pageable pageable);
}
