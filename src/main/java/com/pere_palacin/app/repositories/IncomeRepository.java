package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.IncomeDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface IncomeRepository extends JpaRepository<IncomeDao, UUID> {
    Page<IncomeDao> findAllByUserIdOrderByName(Integer id, Pageable pageable);
}
