package com.pere_palacin.app.controllers;

import com.pere_palacin.app.domains.IncomeDao;
import com.pere_palacin.app.domains.dto.IncomeDto;
import com.pere_palacin.app.domains.sortBys.IncomeSortBy;
import com.pere_palacin.app.mappers.impl.IncomeMapper;
import com.pere_palacin.app.services.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.springframework.http.HttpStatus.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/incomes")
public class IncomeController {

    private final IncomeService incomeService;
    private final IncomeMapper incomeMapper;

    @GetMapping("")
    public List<IncomeDto> listIncomes(
            @RequestParam(defaultValue = "name") IncomeSortBy orderBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "true") boolean ascending,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(required = false) String searchInput
    ) {
        List<IncomeDao> incomes = incomeService.findAllUserIncomes(orderBy, page, pageSize, ascending, fromDate, toDate, searchInput);
        return incomes.stream().map(incomeMapper::mapTo).toList();
    }

    @PostMapping("")
    public ResponseEntity<IncomeDto> createIncome(@Valid @RequestBody IncomeDto incomeDto) {
        IncomeDao incomeDao = incomeMapper.mapFrom(incomeDto);
        IncomeDao savedIncomeDao = incomeService.registerIncome(incomeDao, incomeDto.getIncomeSourceId(), incomeDto.getBankAccountId());
        IncomeDto savedIncomeDto = incomeMapper.mapTo(savedIncomeDao);
        return new ResponseEntity<>(savedIncomeDto, CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeDto> editIncome(@Valid @RequestBody IncomeDto incomeDto, @PathVariable UUID id) {
        IncomeDao incomeDao = incomeMapper.mapFrom(incomeDto);
        IncomeDao updatedIncomeDao = incomeService.updateIncome(id, incomeDao, incomeDto.getIncomeSourceId(), incomeDto.getBankAccountId());
        IncomeDto updatedIncomeDto = incomeMapper.mapTo(updatedIncomeDao);
        return new ResponseEntity<>(updatedIncomeDto, OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<IncomeDto> deleteIncome (@PathVariable UUID id) {
        incomeService.deleteIncome(id);
        return new ResponseEntity<>(null, NO_CONTENT);
    }

    @PostMapping("/delete-batch")
    public ResponseEntity<IncomeDto> deleteIncomesInBatch(@RequestBody Set<UUID> incomesId) {
        incomeService.deleteInBatch(incomesId);
        return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
}
