package com.pere_palacin.app.services;

import com.pere_palacin.app.domains.CategoryDao;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface CategoryService {
    CategoryDao createCategory(CategoryDao categoryDao);
    List<CategoryDao> findAll();
    Set<CategoryDao> findAllById(List<UUID> categoryIds);
    CategoryDao findById(UUID id);
    CategoryDao updateCategory(CategoryDao categoryDao, UUID id);
    void deleteCategory(UUID id);
}
