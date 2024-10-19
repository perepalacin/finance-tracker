package com.pere_palacin.app.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.pere_palacin.app.exceptions.CategoryNotFoundException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.pere_palacin.app.domains.CategoryDao;
import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.repositories.CategoryRespository;
import com.pere_palacin.app.repositories.UserRepository;
import com.pere_palacin.app.services.CategoryService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRespository categoryRespository;
    private final UserRepository userRepository;

    @Override
    public CategoryDao createCategory(CategoryDao categoryDao) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        categoryDao.setUser(user);
        return categoryRespository.save(categoryDao);
    }

    @Override
    public List<CategoryDao> findAll() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDao user = userRepository.findByUsername(username);
        return categoryRespository.findByUserId(user.getId());
    }

    @Override
    public CategoryDao findById(UUID id) {
        return categoryRespository.findById(id).orElseThrow(
                () -> new CategoryNotFoundException(id)
        );
    }

    @Override
    public CategoryDao updateCategory(CategoryDao categoryDao, UUID id) {
        CategoryDao categoryToUpdate = this.findById(id);
        categoryToUpdate.setCategoryName(categoryDao.getCategoryName());
        categoryToUpdate.setIconName(categoryDao.getIconName());
        categoryRespository.save(categoryToUpdate);
        return categoryToUpdate;
    }

    @Override
    public void deleteCategory(UUID id) {
        CategoryDao categoryDao = this.findById(id);
        categoryRespository.delete(categoryDao);
    }
}
