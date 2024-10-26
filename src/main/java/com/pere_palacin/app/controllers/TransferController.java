package com.pere_palacin.app.controllers;

import com.pere_palacin.app.domains.TransferDao;
import com.pere_palacin.app.domains.dto.TransferDto;
import com.pere_palacin.app.mappers.impl.TransferMapper;
import com.pere_palacin.app.services.TransferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static org.springframework.http.HttpStatus.*;


@RestController
@RequestMapping("${api.prefix}/transfers")
@RequiredArgsConstructor
public class TransferController {

    private final TransferMapper transferMapper;
    private final TransferService transferService;

    @GetMapping("")
    public Page<TransferDto> listTransfers() {
        Page<TransferDao> transfers = transferService.findAll();
        return transfers.map(transferMapper::mapTo);
    }

    @PostMapping("")
    public ResponseEntity<TransferDto> createTransfer(@Valid @RequestBody TransferDto transferDto) {
        TransferDao transferDao = transferMapper.mapFrom(transferDto);
        TransferDao savedTransferDao = transferService.registerTransfer(transferDao, transferDto.getReceivingBankAccountId(), transferDto.getSendingBankAccountId());
        TransferDto savedTransferDto = transferMapper.mapTo(savedTransferDao);
        return new ResponseEntity<>(savedTransferDto, CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransferDto> editTransfer(@Valid @RequestBody TransferDto transferDto, @PathVariable UUID id) {
        TransferDao transferDao = transferMapper.mapFrom(transferDto);
        TransferDao updatedTransferDao = transferService.updateTransfer(transferDto.getId(), transferDao, transferDto.getReceivingBankAccountId(), transferDto.getSendingBankAccountId());
        TransferDto updatedTransferDto = transferMapper.mapTo(updatedTransferDao);
        return new ResponseEntity<>(updatedTransferDto, OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TransferDto> deleteTransfer(@PathVariable UUID id) {
        transferService.deleteTransfer(id);
        return new ResponseEntity<>(null, NO_CONTENT);
    }

}