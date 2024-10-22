package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.IncomeSourceDao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface IncomeSourceRepository extends JpaRepository<IncomeSourceDao, UUID> {
    List<IncomeSourceDao> findByUserId(Integer id);
}
