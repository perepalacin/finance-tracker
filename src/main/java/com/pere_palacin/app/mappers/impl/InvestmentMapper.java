package com.pere_palacin.app.mappers.impl;

import com.pere_palacin.app.domains.InvestmentCategoryDao;
import com.pere_palacin.app.domains.InvestmentDao;
import com.pere_palacin.app.domains.dto.*;
import com.pere_palacin.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class InvestmentMapper implements Mapper<InvestmentDao, InvestmentDto> {

    private final ModelMapper modelMapper;
    private final InvestmentCategoryMapper investmentCategoryMapper;
    private final BankAccountMapper bankAccountMapper;

    @Override
    public InvestmentDao mapFrom(InvestmentDto investmentDto) {
        InvestmentDao investmentDao = modelMapper.map(investmentDto, InvestmentDao.class);
        if (investmentDto.getInvestmentCategoryDtos() != null) {
            Set<InvestmentCategoryDao> assignedCategories = investmentDto.getInvestmentCategoryDtos().stream()
                    .map(investmentCategoryMapper::mapFrom)
                    .collect(Collectors.toSet());
            investmentDao.setInvestmentCategories(assignedCategories);
        } else if (investmentDto.getInvestmentCategoriesId() != null) {
            Set<InvestmentCategoryDao> assignedCategoriesIds = investmentDto.getInvestmentCategoriesId().stream()
                    .map(id -> InvestmentCategoryDao.builder().id(id).build())
                    .collect(Collectors.toSet());
            investmentDao.setInvestmentCategories(assignedCategoriesIds);
        }
        if (investmentDto.getBankAccountDto() != null) {
            investmentDao.setBankAccount(bankAccountMapper.mapFrom(investmentDto.getBankAccountDto()));
        }
        return investmentDao;
    }

    @Override
    public InvestmentDto mapTo(InvestmentDao investmentDao) {
        InvestmentDto investmentDto = modelMapper.map(investmentDao, InvestmentDto.class);
        if (investmentDao.getInvestmentCategories() != null) {
            investmentDto.setInvestmentCategoryDtos(
                    investmentDao.getInvestmentCategories().stream()
                            .map(investmentCategoryMapper::mapTo).collect(Collectors.toSet()));
        }
        if (investmentDao.getBankAccount() != null) {
            investmentDto.setBankAccountDto(bankAccountMapper.mapTo(investmentDao.getBankAccount()));
        }
        return investmentDto;
    }
}

