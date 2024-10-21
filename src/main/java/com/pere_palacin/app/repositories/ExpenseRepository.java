package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.BankAccountDao;
import com.pere_palacin.app.domains.ExpenseDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExpenseRepository extends JpaRepository<ExpenseDao, UUID> {
    Page<ExpenseDao> findAllByUserIdOrderByName(Integer id, Pageable pageable);
}
