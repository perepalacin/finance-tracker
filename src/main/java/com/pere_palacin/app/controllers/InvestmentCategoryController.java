package com.pere_palacin.app.controllers;

import com.pere_palacin.app.domains.InvestmentCategoryDao;
import com.pere_palacin.app.domains.dto.InvestmentCategoryDto;
import com.pere_palacin.app.mappers.impl.InvestmentCategoryMapper;
import com.pere_palacin.app.services.InvestmentCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/investment-categories")
public class InvestmentCategoryController {

    private final InvestmentCategoryMapper investmentCategoryMapper;
    private final InvestmentCategoryService investmentCategoryService;

    @GetMapping("")
    public List<InvestmentCategoryDto> listInvestmentCategories() {
        List<InvestmentCategoryDao> investmentCategories = investmentCategoryService.findAll();
        return investmentCategories.stream().map(investmentCategoryMapper::mapTo).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvestmentCategoryDto> getInvestmentCategory (@PathVariable UUID id) {
        InvestmentCategoryDao foundInvestmentCategoryDao = investmentCategoryService.findById(id);
        InvestmentCategoryDto investmentCategoryDto = investmentCategoryMapper.mapTo(foundInvestmentCategoryDao);
        return new ResponseEntity<>(investmentCategoryDto, HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<InvestmentCategoryDto> createInvestmentCategory(@Valid @RequestBody InvestmentCategoryDto investmentCategoryDto) {
        InvestmentCategoryDao investmentCategoryDao = investmentCategoryMapper.mapFrom(investmentCategoryDto);
        InvestmentCategoryDao savedInvestmentCategoryDao = investmentCategoryService.createInvestmentCategory(investmentCategoryDao);
        InvestmentCategoryDto savedInvestmentCategoryDto = investmentCategoryMapper.mapTo(savedInvestmentCategoryDao);
        return new ResponseEntity<>(savedInvestmentCategoryDto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvestmentCategoryDto> updateInvestmentCategory(@Valid @RequestBody InvestmentCategoryDto investmentCategoryDto, @PathVariable UUID id) {
        InvestmentCategoryDao investmentCategoryDao = investmentCategoryMapper.mapFrom(investmentCategoryDto);
        InvestmentCategoryDao savedInvestmentCategoryDao = investmentCategoryService.updateInvestmentCategory(investmentCategoryDao, id);
        InvestmentCategoryDto savedInvestmentCategoryDto = investmentCategoryMapper.mapTo(investmentCategoryDao);
        return new ResponseEntity<>(savedInvestmentCategoryDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<InvestmentCategoryDto> deleteInvestmentCategory (@PathVariable UUID id) {
        investmentCategoryService.deleteInvestmentCategory(id);
        return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
}
