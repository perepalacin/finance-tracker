package com.pere_palacin.app.services.impl;

import java.util.*;
import java.util.stream.Collectors;

import com.pere_palacin.app.domains.ExpenseDao;
import com.pere_palacin.app.exceptions.CategoryNotFoundException;
import com.pere_palacin.app.repositories.CategoryRepository;
import com.pere_palacin.app.services.AuthService;
import com.pere_palacin.app.services.UserDetailsServiceImpl;
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
    private final AuthService authService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public CategoryDao createCategory(CategoryDao categoryDao) {
        UUID userId = userDetailsService.getRequestingUserId();
        UserDao user = UserDao.builder().id(userId).build();
        categoryDao.setUser(user);
        return categoryRepository.save(categoryDao);
    }

    @Override
    public List<CategoryDao> findAll() {
        UUID userId = userDetailsService.getRequestingUserId();
        return categoryRepository.findByUserId(userId);
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
        authService.authorizeRequest(categoryDaos.stream().map(categoryDao -> categoryDao.getUser().getId()).collect(Collectors.toSet()), null);
        return new HashSet<>(categoryDaos);
    }

    @Override
    public CategoryDao findById(UUID id) {
        CategoryDao categoryDao = categoryRepository.findById(id).orElseThrow(
                () -> new CategoryNotFoundException(id)
        );
        authService.authorizeRequest(categoryDao.getUser().getId(), null);
        return categoryDao;
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
        for (ExpenseDao expense : categoryDao.getExpensesAssociated()) {
            expense.getExpenseCategories().remove(categoryDao);
        }
        categoryDao.getExpensesAssociated().clear();
        categoryRepository.delete(categoryDao);
    }
}
