package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.CategoryDao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryDao, UUID> {
    List<CategoryDao> findByUserId(UUID id);
}
