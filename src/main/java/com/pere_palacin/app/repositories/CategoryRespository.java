package com.pere_palacin.app.repositories;

import com.pere_palacin.app.domains.CategoryDao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryRespository extends JpaRepository<CategoryDao, UUID> {
    List<CategoryDao> findByUserId(Integer id);
}
