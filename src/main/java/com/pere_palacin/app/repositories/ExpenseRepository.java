package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.ExpenseDao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ExpenseRepository extends JpaRepository<ExpenseDao, UUID> {
}
