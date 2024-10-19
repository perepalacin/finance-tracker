package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.BankAccountDao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BankAccountRepository extends JpaRepository<BankAccountDao, UUID> {
    List<BankAccountDao> findByUserId(Integer id);
}
