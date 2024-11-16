package com.pere_palacin.app.repositories;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pere_palacin.app.domains.ExpenseDao;

@Repository
public interface ExpenseRepository extends JpaRepository<ExpenseDao, UUID> {
    Page<ExpenseDao> findAllByUserId(UUID userId, Pageable pageable);
    Page<ExpenseDao> findAllByUserIdAndAnnotationContainingIgnoreCaseOrNameContainingIgnoreCase(UUID userId, String annotation, String name, Pageable pageable);
    Page<ExpenseDao> findAllByUserIdAndDateAfterAndDateBefore(UUID userId, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    Page<ExpenseDao> findAllByUserIdAndAnnotationContainingIgnoreCaseOrNameContainingIgnoreCaseAndDateAfterAndDateBefore(UUID userId, String annotation, String name, LocalDate fromDate, LocalDate toDate, Pageable pageable);
}