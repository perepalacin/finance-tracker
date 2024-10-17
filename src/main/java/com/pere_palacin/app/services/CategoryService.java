package com.pere_palacin.app.services;

import com.pere_palacin.app.domains.CategoryDao;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryService {
    CategoryDao createCategory(CategoryDao categoryDao);
    List<CategoryDao> findAll();
    Optional<CategoryDao> findById(UUID id);
}
