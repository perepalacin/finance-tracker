package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.InvestmentDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface InvestmentRepository extends JpaRepository<InvestmentDao, UUID> {
    Page<InvestmentDao> findAllByUserIdOrderByName(UUID id, Pageable pageable);
}
