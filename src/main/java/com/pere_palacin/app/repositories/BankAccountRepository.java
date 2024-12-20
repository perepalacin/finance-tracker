package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.BankAccountDao;
import com.pere_palacin.app.domains.ExpenseDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccountDao, UUID> {
    Page<BankAccountDao> findAllByUserId(UUID userId, Pageable pageable);
}
