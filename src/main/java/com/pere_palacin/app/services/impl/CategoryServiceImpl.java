package com.pere_palacin.app.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
        return categoryRespository.findAll();
    }

    @Override
    public Optional<CategoryDao> findById(UUID id) {
        return categoryRespository.findById(id);
    }
}
