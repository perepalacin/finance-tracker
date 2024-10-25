package com.pere_palacin.app.mappers.impl;

import com.pere_palacin.app.domains.TransferDao;
import com.pere_palacin.app.domains.dto.BankAccountDto;
import com.pere_palacin.app.domains.dto.TransferDto;
import com.pere_palacin.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class TransferMapper implements Mapper<TransferDao, TransferDto> {

    private final ModelMapper modelMapper;
    private final BankAccountMapper bankAccountMapper;

    @Override
    public TransferDao mapFrom(TransferDto transferDto) {
        TransferDao transferDao = modelMapper.map(transferDto, TransferDao.class);
        if (transferDto.getReceivingBankAccountDto() != null) {
            transferDao.setReceivingAccount(bankAccountMapper.mapFrom(transferDto.getReceivingBankAccountDto()));
        }
        if (transferDto.getSendingBankAccountDto() != null) {
            transferDao.setSendingAccount(bankAccountMapper.mapFrom(transferDto.getSendingBankAccountDto()));
        }
        return transferDao;
    }

    @Override
    public TransferDto mapTo(TransferDao transferDao) {
        TransferDto transferDto = modelMapper.map(transferDao, TransferDto.class);
        if (transferDao.getReceivingAccount() != null) {
            BankAccountDto receivingBankAccountDto = bankAccountMapper.mapTo(transferDao.getReceivingAccount());
            transferDto.setReceivingBankAccountDto(receivingBankAccountDto);
        }
        if (transferDao.getSendingAccount() != null) {
            BankAccountDto sendingBankAccountDto = bankAccountMapper.mapTo(transferDao.getSendingAccount());
            transferDto.setSendingBankAccountDto(sendingBankAccountDto);
        }
        return transferDto;
    }
}
