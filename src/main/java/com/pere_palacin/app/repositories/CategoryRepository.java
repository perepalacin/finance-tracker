package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.CategoryDao;
import com.pere_palacin.app.domains.dto.ExpensesCategoryWithAmountDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryDao, UUID> {
    List<CategoryDao> findByUserId(UUID id);
    @Query("SELECT new com.pere_palacin.app.domains.dto.ExpensesCategoryWithAmountDto(c.id, SUM(e.amount), SUM(CASE WHEN e.date >= :startDate AND e.date < :endDate THEN e.amount ELSE 0 END)) " +
            "FROM CategoryDao c JOIN c.expensesAssociated e WHERE c.user.id = :userId " +
            "GROUP BY c.id " +
            "ORDER BY SUM(e.amount) DESC")
    List<ExpensesCategoryWithAmountDto> findExpensesGroupedByCategoryID(
            @Param("userId") UUID userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
