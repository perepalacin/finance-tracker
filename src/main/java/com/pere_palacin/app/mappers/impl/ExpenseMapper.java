package com.pere_palacin.app.mappers.impl;

import com.pere_palacin.app.domains.BankAccountDao;
import com.pere_palacin.app.domains.CategoryDao;
import com.pere_palacin.app.domains.ExpenseDao;
import com.pere_palacin.app.domains.dto.BankAccountDto;
import com.pere_palacin.app.domains.dto.CategoryDto;
import com.pere_palacin.app.domains.dto.ExpenseDto;
import com.pere_palacin.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ExpenseMapper implements Mapper<ExpenseDao, ExpenseDto> {

    private final ModelMapper modelMapper;
    private final CategoryMapper categoryMapper;
    private final BankAccountMapper bankAccountMapper;

       @Override
       public ExpenseDto mapTo(ExpenseDao expenseDao) {

           Set<CategoryDto> categoryDtos = expenseDao.getExpenseCategories().stream()
                       .map(categoryMapper::mapTo)
                       .collect(Collectors.toSet());

           BankAccountDto bankAccountDto = expenseDao.getBankAccount() != null ? bankAccountMapper.mapTo(expenseDao.getBankAccount()) : null;

           return ExpenseDto.builder()
                   .id(expenseDao.getId())
                   .name(expenseDao.getName())
                   .amount(expenseDao.getAmount())
                   .annotation(expenseDao.getAnnotation())
                   .expenseCategoryDtos(categoryDtos)
                   .bankAccountDto(bankAccountDto)
                   .date(expenseDao.getDate())
                   .build();
       }

       @Override
       public ExpenseDao mapFrom(ExpenseDto expenseDto) {
           ExpenseDao expenseDao = modelMapper.map(expenseDto, ExpenseDao.class);
           if (expenseDto.getExpenseCategoryDtos() != null) {
               Set<CategoryDao> assignedCategories = expenseDto.getExpenseCategoryDtos().stream()
                       .map(categoryMapper::mapFrom)
                       .collect(Collectors.toSet());
               expenseDao.setExpenseCategories(assignedCategories);
           } else if (expenseDto.getExpenseCategoryIds() != null) {
               Set<CategoryDao> assignedCategoriesIds = expenseDto.getExpenseCategoryIds().stream()
                       .map(id -> CategoryDao.builder().id(id).build())
                       .collect(Collectors.toSet());
               expenseDao.setExpenseCategories(assignedCategoriesIds);
           }
           if (expenseDto.getBankAccountDto() != null) {
               expenseDao.setBankAccount(bankAccountMapper.mapFrom(expenseDto.getBankAccountDto()));
           }
           return expenseDao;
       }
}
