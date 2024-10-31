package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.BankAccountDao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccountDao, UUID> {
    List<BankAccountDao> findByUserId(UUID id);
}
