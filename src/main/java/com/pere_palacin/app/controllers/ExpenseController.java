package com.pere_palacin.app.controllers;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import static org.springframework.http.HttpStatus.CREATED;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pere_palacin.app.domains.ExpenseDao;
import com.pere_palacin.app.domains.dto.ExpenseDto;
import com.pere_palacin.app.mappers.impl.ExpenseMapper;
import com.pere_palacin.app.services.ExpenseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/expenses")
public class ExpenseController {

    private final ExpenseMapper expenseMapper;
    private final ExpenseService expenseService;

    @GetMapping("")
    public Page<ExpenseDto> listExpenses() {
        Page<ExpenseDao> expenses = expenseService.findAll();
        return expenses.map(expenseMapper::mapTo);
    }

    @PostMapping("")
    public ResponseEntity<ExpenseDto> createExpense(@Valid @RequestBody ExpenseDto expenseDto) {
        ExpenseDao expenseDao = expenseMapper.mapFrom(expenseDto);
        ExpenseDao savedExpenseDao = expenseService.registerExpense(expenseDao, expenseDto.getCategoryId(), expenseDto.getBankAccountId());
        ExpenseDto savedExpenseDto = expenseMapper.mapTo(savedExpenseDao);
        return new ResponseEntity<>(savedExpenseDto, CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDto> editExpense(@Valid @RequestBody ExpenseDto expenseDto, @PathVariable UUID id) {
        ExpenseDao expenseDao = expenseMapper.mapFrom(expenseDto);
        ExpenseDao updatedExpenseDao = expenseService.updateExpense(id, expenseDao, expenseDto.getCategoryId(), expenseDto.getBankAccountId());
        ExpenseDto updatedExpenseDto = expenseMapper.mapTo(updatedExpenseDao);
        return new ResponseEntity<>(updatedExpenseDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ExpenseDto> deleteCategory (@PathVariable UUID id) {
        expenseService.deleteExpense(id);
        return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
}
