package com.pere_palacin.app.controllers;

import com.pere_palacin.app.domains.BankAccountDao;
import com.pere_palacin.app.domains.CategoryDao;
import com.pere_palacin.app.domains.dto.BankAccountDto;
import com.pere_palacin.app.domains.dto.CategoryDto;
import com.pere_palacin.app.mappers.impl.BankAccountMapper;
import com.pere_palacin.app.mappers.impl.CategoryMapper;
import com.pere_palacin.app.services.BankAccountService;
import com.pere_palacin.app.services.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/accounts")
public class BankAccountController {

    private final BankAccountService bankAccountService;
    private final BankAccountMapper bankAccountMapper;

    @GetMapping("")
    public List<BankAccountDto> listBankAccounts() {
        List<BankAccountDao> accounts = bankAccountService.findAll();
        return accounts.stream().map(bankAccountMapper::mapTo).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BankAccountDto> getAccount (@PathVariable UUID id) {
        BankAccountDao foundAccountDao = bankAccountService.findById(id);
        BankAccountDto accountDto = bankAccountMapper.mapTo(foundAccountDao);
        return new ResponseEntity<>(accountDto, HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<BankAccountDto> createBankAccount(@Valid @RequestBody BankAccountDto bankAccountDto) {
        BankAccountDao bankAccountDao = bankAccountMapper.mapFrom(bankAccountDto);
        BankAccountDao savedBankAccountDao = bankAccountService.createAccount(bankAccountDao);
        BankAccountDto savedAccountDto = bankAccountMapper.mapTo(savedBankAccountDao);
        return new ResponseEntity<>(savedAccountDto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BankAccountDto> updateAccount(@PathVariable UUID id, @Valid @RequestBody BankAccountDto bankAccountDto) {
        BankAccountDao bankAccountDao = bankAccountMapper.mapFrom(bankAccountDto);
        BankAccountDao updatedBankAccountDao = bankAccountService.updateAccount(id, bankAccountDao);
        BankAccountDto updatedBankAccountDto = bankAccountMapper.mapTo(updatedBankAccountDao);
        return new ResponseEntity<>(updatedBankAccountDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BankAccountDto> deleteBankAccount (@PathVariable UUID id) {
        bankAccountService.deleteAccount(id);
        return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
}
