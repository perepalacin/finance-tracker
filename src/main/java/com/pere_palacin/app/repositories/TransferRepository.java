package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.IncomeDao;
import com.pere_palacin.app.domains.TransferDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface TransferRepository extends JpaRepository<TransferDao, UUID> {
    Page<TransferDao> findAllByUserId(UUID userId, Pageable pageable);
    Page<TransferDao> findAllByUserIdAndAnnotationContainingIgnoreCaseOrNameContainingIgnoreCase(UUID userId, String annotation, String name, Pageable pageable);
    Page<TransferDao> findAllByUserIdAndDateAfterAndDateBefore(UUID userId, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    Page<TransferDao> findAllByUserIdAndAnnotationContainingIgnoreCaseOrNameContainingIgnoreCaseAndDateAfterAndDateBefore(UUID userId, String annotation, String name, LocalDate fromDate, LocalDate toDate, Pageable pageable);
}
