package com.pere_palacin.app.services.impl;

import java.util.*;
import java.util.stream.Collectors;

import com.pere_palacin.app.exceptions.CategoryNotFoundException;
import com.pere_palacin.app.repositories.CategoryRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.pere_palacin.app.domains.CategoryDao;
import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.repositories.UserRepository;
import com.pere_palacin.app.services.CategoryService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Override
    public CategoryDao createCategory(CategoryDao categoryDao) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        categoryDao.setUser(user);
        return categoryRepository.save(categoryDao);
    }

    @Override
    public List<CategoryDao> findAll() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        return categoryRepository.findByUserId(user.getId());
    }

    @Override
    public Set<CategoryDao> findAllById(List<UUID> categoryIds) {
        List<CategoryDao> categoryDaos = categoryRepository.findAllById(categoryIds);
        Set<UUID> foundIds = categoryDaos.stream()
                .map(CategoryDao::getId)
                .collect(Collectors.toSet());
        for (UUID id : categoryIds) {
            if (!foundIds.contains(id)) {
                throw new CategoryNotFoundException(id);
            }
        }
        return new HashSet<>(categoryDaos);
    }

    @Override
    public CategoryDao findById(UUID id) {
        return categoryRepository.findById(id).orElseThrow(
                () -> new CategoryNotFoundException(id)
        );
    }

    @Override
    public CategoryDao updateCategory(CategoryDao categoryDao, UUID id) {
        CategoryDao categoryToUpdate = this.findById(id);
        categoryToUpdate.setCategoryName(categoryDao.getCategoryName());
        categoryToUpdate.setIconName(categoryDao.getIconName());
        categoryRepository.save(categoryToUpdate);
        return categoryToUpdate;
    }

    @Override
    public void deleteCategory(UUID id) {
        CategoryDao categoryDao = this.findById(id);
        categoryRepository.delete(categoryDao);
    }
}
