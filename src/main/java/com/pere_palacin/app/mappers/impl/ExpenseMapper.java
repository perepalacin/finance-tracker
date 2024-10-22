package com.pere_palacin.app.mappers.impl;

import com.pere_palacin.app.domains.ExpenseDao;
import com.pere_palacin.app.domains.dto.BankAccountDto;
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
    private final CategoryMapper categoryMapper;
    private final BankAccountMapper bankAccountMapper;

@Override
       public ExpenseDto mapTo(ExpenseDao expenseDao) {
           ExpenseDto expenseDto = modelMapper.map(expenseDao, ExpenseDto.class);
           if (expenseDao.getCategory() != null) {
               CategoryDto categoryDto = categoryMapper.mapTo(expenseDao.getCategory());
               expenseDto.setCategoryDto(categoryDto);
           }
           if (expenseDao.getBankAccount() != null) {
               BankAccountDto bankAccountDto = bankAccountMapper.mapTo(expenseDao.getBankAccount());
               expenseDto.setBankAccountDto(bankAccountDto);
           }
           return expenseDto;
       }

       @Override
       public ExpenseDao mapFrom(ExpenseDto expenseDto) {
           ExpenseDao expenseDao = modelMapper.map(expenseDto, ExpenseDao.class);
           if (expenseDto.getCategoryDto() != null) {
               expenseDao.setCategory(categoryMapper.mapFrom(expenseDto.getCategoryDto()));
           }
           if (expenseDto.getBankAccountDto() != null) {
               expenseDao.setBankAccount(bankAccountMapper.mapFrom(expenseDto.getBankAccountDto()));
           }
           return expenseDao;
       }
}
