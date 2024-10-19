package com.pere_palacin.app.mappers.impl;

import com.pere_palacin.app.domains.BankAccountDao;
import com.pere_palacin.app.domains.CategoryDao;
import com.pere_palacin.app.domains.dto.BankAccountDto;
import com.pere_palacin.app.domains.dto.CategoryDto;
import com.pere_palacin.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BankAccountMapper implements Mapper<BankAccountDao, BankAccountDto> {

    private final ModelMapper modelMapper;

    @Override
    public BankAccountDao mapFrom(BankAccountDto bankAccountDto) {
        return modelMapper.map(bankAccountDto, BankAccountDao.class);
    }

    @Override
    public BankAccountDto mapTo(BankAccountDao bankAccountDao) {
        return modelMapper.map(bankAccountDao, BankAccountDto.class);
    }
}
