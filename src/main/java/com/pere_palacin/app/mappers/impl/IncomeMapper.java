package com.pere_palacin.app.mappers.impl;

import com.pere_palacin.app.domains.ExpenseDao;
import com.pere_palacin.app.domains.IncomeDao;
import com.pere_palacin.app.domains.dto.*;
import com.pere_palacin.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class IncomeMapper implements Mapper<IncomeDao, IncomeDto> {

    private final ModelMapper modelMapper;
    private final IncomeSourceMapper incomeSourceMapper;
    private final BankAccountMapper bankAccountMapper;

    @Override
    public IncomeDao mapFrom(IncomeDto incomeDto) {
        IncomeDao incomeDao = modelMapper.map(incomeDto, IncomeDao.class);
        if (incomeDto.getIncomeSourceDto() != null) {
            incomeDao.setIncomeSourceDao(incomeSourceMapper.mapFrom(incomeDto.getIncomeSourceDto()));
        }
        if (incomeDto.getBankAccountDto() != null) {
            incomeDao.setBankAccount(bankAccountMapper.mapFrom(incomeDto.getBankAccountDto()));
        }
        return incomeDao;
    }

    @Override
    public IncomeDto mapTo(IncomeDao incomeDao) {
        IncomeDto incomeDto = modelMapper.map(incomeDao, IncomeDto.class);
        if (incomeDao.getIncomeSourceDao() != null) {
            IncomeSourceDto incomeSourceDto = incomeSourceMapper.mapTo(incomeDao.getIncomeSourceDao());
            incomeDto.setIncomeSourceDto(incomeSourceDto);
        }
        if (incomeDao.getBankAccount() != null) {
            BankAccountDto bankAccountDto = bankAccountMapper.mapTo(incomeDao.getBankAccount());
            incomeDto.setBankAccountDto(bankAccountDto);
        }
        return incomeDto;
    }
}
