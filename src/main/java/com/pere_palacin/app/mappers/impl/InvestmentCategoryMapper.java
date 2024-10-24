package com.pere_palacin.app.mappers.impl;

import com.pere_palacin.app.domains.IncomeSourceDao;
import com.pere_palacin.app.domains.InvestmentCategoryDao;
import com.pere_palacin.app.domains.dto.IncomeSourceDto;
import com.pere_palacin.app.domains.dto.InvestmentCategoryDto;
import com.pere_palacin.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InvestmentCategoryMapper implements Mapper<InvestmentCategoryDao, InvestmentCategoryDto> {

    private final ModelMapper modelMapper;

    @Override
    public InvestmentCategoryDao mapFrom(InvestmentCategoryDto investmentCategoryDto) {
        return modelMapper.map(investmentCategoryDto, InvestmentCategoryDao.class);
    }

    @Override
    public InvestmentCategoryDto mapTo(InvestmentCategoryDao investmentCategoryDao) {
        return modelMapper.map(investmentCategoryDao, InvestmentCategoryDto.class);
    }
}
