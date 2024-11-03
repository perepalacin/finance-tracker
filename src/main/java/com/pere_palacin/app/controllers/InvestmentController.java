package com.pere_palacin.app.controllers;

import com.pere_palacin.app.domains.InvestmentDao;
import com.pere_palacin.app.domains.dto.InvestmentDto;
import com.pere_palacin.app.domains.sortBys.IncomeSortBy;
import com.pere_palacin.app.domains.sortBys.InvestmentSortBy;
import com.pere_palacin.app.mappers.impl.InvestmentMapper;
import com.pere_palacin.app.services.InvestmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("${api.prefix}/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private final InvestmentMapper investmentMapper;
    private final InvestmentService investmentService;

    @GetMapping("")
    public List<InvestmentDto> listInvestments(
            @RequestParam(defaultValue = "name") InvestmentSortBy orderBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "true") boolean ascending
    ) {
        List<InvestmentDao> investmentsDao = investmentService.findAll(orderBy, page, pageSize, ascending);
        return investmentsDao.stream().map(investmentMapper::mapTo).toList();
    }

    @PostMapping("")
    public ResponseEntity<InvestmentDto> createInvestment(@Valid @RequestBody InvestmentDto investmentDto) {
        InvestmentDao investmentDao = investmentMapper.mapFrom(investmentDto);
        InvestmentDao savedInvestmentDao = investmentService.createInvestment(investmentDao, investmentDto.getBankAccountId());
        InvestmentDto savedInvestmentDto = investmentMapper.mapTo(savedInvestmentDao);
        return new ResponseEntity<>(savedInvestmentDto, CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvestmentDto> editInvestment(@Valid @RequestBody InvestmentDto investmentDto, @PathVariable UUID id) {
        InvestmentDao investmentDao = investmentMapper.mapFrom(investmentDto);
        InvestmentDao updatedInvestmentDao = investmentService.updateInvestment(id, investmentDao, investmentDto.getBankAccountId());
        InvestmentDto updatedInvestmentDto = investmentMapper.mapTo(updatedInvestmentDao);
        return new ResponseEntity<>(updatedInvestmentDto, OK);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<InvestmentDto> deleteInvestment (@PathVariable UUID id) {
        investmentService.deleteInvestment(id);
    return new ResponseEntity<>(null, NO_CONTENT);
    }
}
