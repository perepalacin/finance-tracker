package com.pere_palacin.app.mappers.impl;

import com.pere_palacin.app.domains.IncomeDao;
import com.pere_palacin.app.domains.InvestmentDao;
import com.pere_palacin.app.domains.dto.BankAccountDto;
import com.pere_palacin.app.domains.dto.IncomeDto;
import com.pere_palacin.app.domains.dto.IncomeSourceDto;
import com.pere_palacin.app.domains.dto.InvestmentDto;
import com.pere_palacin.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InvestmentMapper implements Mapper<InvestmentDao, InvestmentDto> {

    private final ModelMapper modelMapper;
    private final InvestmentCategoryMapper investmentCategoryMapper;
    private final BankAccountMapper bankAccountMapper;

    @Override
    public InvestmentDao mapFrom(InvestmentDto investmentDto) {
        InvestmentDao investmentDao = modelMapper.map(investmentDto, InvestmentDao.class);
        if (investmentDto.getInvestmentCategoryDto() != null) {
            investmentDao.setInvestmentCategory(investmentCategoryMapper.mapFrom(investmentDto.getInvestmentCategoryDto()));
        }
        if (investmentDto.getBankAccountDto() != null) {
            investmentDao.setBankAccount(bankAccountMapper.mapFrom(investmentDto.getBankAccountDto()));
        }
        return investmentDao;
    }

    @Override
    public InvestmentDto mapTo(InvestmentDao investmentDao) {
        InvestmentDto investmentDto = modelMapper.map(investmentDao, InvestmentDto.class);
        if (investmentDao.getInvestmentCategory() != null) {
            investmentDto.setInvestmentCategoryDto(investmentCategoryMapper.mapTo(investmentDao.getInvestmentCategory()));
        }
        if (investmentDao.getBankAccount() != null) {
            investmentDto.setBankAccountDto(bankAccountMapper.mapTo(investmentDao.getBankAccount()));
        }
        return investmentDto;
    }
}

