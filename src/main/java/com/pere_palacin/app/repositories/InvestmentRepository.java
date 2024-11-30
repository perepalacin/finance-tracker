package com.pere_palacin.app.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pere_palacin.app.domains.InvestmentDao;

@Repository
public interface InvestmentRepository extends JpaRepository<InvestmentDao, UUID> {
    Page<InvestmentDao> findAllByUserId(UUID userId, Pageable pageable);
    Page<InvestmentDao> findAllByUserIdAndAnnotationContainingIgnoreCaseOrNameContainingIgnoreCase(UUID userId, String annotation, String name, Pageable pageable);
    Page<InvestmentDao> findAllByUserIdAndStartDateBetweenOrEndDateBetween(UUID userId, LocalDate startDateFrom, LocalDate startDateTo, LocalDate endDateFrom, LocalDate endDateTo, Pageable pageable);

    @Query("SELECT i FROM InvestmentDao i WHERE i.user.id = :userId AND " +
           "(LOWER(i.annotation) LIKE LOWER(CONCAT('%', :searchInput, '%')) OR " +
           "LOWER(i.name) LIKE LOWER(CONCAT('%', :searchInput, '%'))) AND " +
           "(i.startDate BETWEEN :fromDate AND :toDate OR i.endDate BETWEEN :fromDate AND :toDate)")
    Page<InvestmentDao> findInvestmentsWithSearchInputBetweenTwoDates(
        @Param("userId") UUID userId,
        @Param("searchInput") String searchInput,
        @Param("fromDate") LocalDate fromDate,
        @Param("toDate") LocalDate toDate,
        Pageable pageable
    );

    List<InvestmentDao> findAllByUserIdAndEndDateBetween(UUID userId, LocalDate endDateFrom, LocalDate endDateTo);

    void deleteByIdInAndUserId(List<UUID> ids, UUID userId);
}
