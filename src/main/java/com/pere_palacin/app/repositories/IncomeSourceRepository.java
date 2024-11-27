package com.pere_palacin.app.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pere_palacin.app.domains.IncomeSourceDao;

@Repository
public interface IncomeSourceRepository extends JpaRepository<IncomeSourceDao, UUID> {
    List<IncomeSourceDao> findByUserId(UUID id);
}
