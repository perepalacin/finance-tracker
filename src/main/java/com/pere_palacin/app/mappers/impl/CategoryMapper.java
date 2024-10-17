package com.pere_palacin.app.mappers.impl;

import com.pere_palacin.app.domains.CategoryDao;
import com.pere_palacin.app.domains.dto.CategoryDto;
import com.pere_palacin.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryMapper implements Mapper<CategoryDao, CategoryDto> {

    private final ModelMapper modelMapper;

    @Override
    public CategoryDao mapFrom(CategoryDto categoryDto) {
        return modelMapper.map(categoryDto, CategoryDao.class);

    }

    @Override
    public CategoryDto mapTo(CategoryDao categoryDao) {
        return modelMapper.map(categoryDao, CategoryDto.class);
    }
}
