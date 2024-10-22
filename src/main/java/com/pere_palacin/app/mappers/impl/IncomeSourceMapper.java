package com.pere_palacin.app.mappers.impl;

import com.pere_palacin.app.domains.IncomeSourceDao;
import com.pere_palacin.app.domains.dto.IncomeSourceDto;
import com.pere_palacin.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class IncomeSourceMapper implements Mapper<IncomeSourceDao, IncomeSourceDto> {

    private final ModelMapper modelMapper;

    @Override
    public IncomeSourceDao mapFrom(IncomeSourceDto incomeSourceDto) {
        return modelMapper.map(incomeSourceDto, IncomeSourceDao.class);
    }

    @Override
    public IncomeSourceDto mapTo(IncomeSourceDao incomeSourceDao) {
        return modelMapper.map(incomeSourceDao, IncomeSourceDto.class);
    }
}
