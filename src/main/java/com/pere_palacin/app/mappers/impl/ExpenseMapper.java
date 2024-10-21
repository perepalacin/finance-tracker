package com.pere_palacin.app.mappers.impl;

import com.pere_palacin.app.domains.CategoryDao;
import com.pere_palacin.app.domains.ExpenseDao;
import com.pere_palacin.app.domains.dto.CategoryDto;
import com.pere_palacin.app.domains.dto.ExpenseDto;
import com.pere_palacin.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ExpenseMapper implements Mapper<ExpenseDao, ExpenseDto> {

    private final ModelMapper modelMapper;

    @Override
    public ExpenseDao mapFrom(ExpenseDto expenseDto) {
        return modelMapper.map(expenseDto, ExpenseDao.class);
    }

    @Override
    public ExpenseDto mapTo(ExpenseDao expenseDao) {
        return modelMapper.map(expenseDao, ExpenseDto.class);
    }
}
