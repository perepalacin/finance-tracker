package com.pere_palacin.app.controllers;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pere_palacin.app.domains.CategoryDao;
import com.pere_palacin.app.domains.dto.CategoryDto;
import com.pere_palacin.app.mappers.impl.CategoryMapper;
import com.pere_palacin.app.services.CategoryService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    @GetMapping("")
    public List<CategoryDto> listCategories() {
        List<CategoryDao> categories = categoryService.findAll();
        return categories.stream().map(categoryMapper::mapTo).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategory (@PathVariable UUID id) {
        Optional<CategoryDao> foundCategoryDao = categoryService.findById(id);
        return foundCategoryDao.map(categoryDao -> {
            CategoryDto categoryDto = categoryMapper.mapTo(categoryDao);
            return new ResponseEntity<>(categoryDto, HttpStatus.OK);
        }).orElse(new ResponseEntity<>(NOT_FOUND));
    }

    @PostMapping("")
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) {
        CategoryDao categoryDao = categoryMapper.mapFrom(categoryDto);
        CategoryDao savedCategoryDao = categoryService.createCategory(categoryDao);
        CategoryDto savedCategoryDto = categoryMapper.mapTo(savedCategoryDao);
        return new ResponseEntity<>(savedCategoryDto, HttpStatus.CREATED);
    }
}
