package com.pere_palacin.app.controllers;

import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;
import static org.springframework.http.HttpStatus.OK;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pere_palacin.app.domains.TransferDao;
import com.pere_palacin.app.domains.dto.TransferDto;
import com.pere_palacin.app.domains.sortBys.TransferSortBy;
import com.pere_palacin.app.mappers.impl.TransferMapper;
import com.pere_palacin.app.services.TransferService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("${api.prefix}/transfers")
@RequiredArgsConstructor
public class TransferController {

    private final TransferMapper transferMapper;
    private final TransferService transferService;

    @GetMapping("")
    public List<TransferDto> listTransfers(
            @RequestParam(defaultValue = "name") TransferSortBy orderBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "true") boolean ascending
    ) {
        List<TransferDao> transfers = transferService.findAll(orderBy, page, pageSize, ascending);
        return transfers.stream().map(transferMapper::mapTo).toList();
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
        TransferDao updatedTransferDao = transferService.updateTransfer(id, transferDao, transferDto.getReceivingBankAccountId(), transferDto.getSendingBankAccountId());
        TransferDto updatedTransferDto = transferMapper.mapTo(updatedTransferDao);
        return new ResponseEntity<>(updatedTransferDto, OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TransferDto> deleteTransfer(@PathVariable UUID id) {
        transferService.deleteTransfer(id);
        return new ResponseEntity<>(null, NO_CONTENT);
    }

}