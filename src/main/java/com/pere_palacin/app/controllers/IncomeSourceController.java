package com.pere_palacin.app.controllers;

import com.pere_palacin.app.domains.IncomeSourceDao;
import com.pere_palacin.app.domains.dto.IncomeSourceDto;
import com.pere_palacin.app.mappers.impl.IncomeSourceMapper;
import com.pere_palacin.app.services.IncomeSourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/sources")
public class IncomeSourceController {
    private final IncomeSourceMapper incomeSourceMapper;
    private final IncomeSourceService incomeSourceService;

    @GetMapping("")
    public List<IncomeSourceDto> listIncomeSources() {
        List<IncomeSourceDao> incomeSources = incomeSourceService.getAll();
        return incomeSources.stream().map(incomeSourceMapper::mapTo).collect(Collectors.toList());
    }

    @PostMapping("")
    public ResponseEntity<IncomeSourceDto> createIncomeSource(@Valid @RequestBody IncomeSourceDto incomeSourceDto) {
        IncomeSourceDao incomeSourceDao = incomeSourceMapper.mapFrom(incomeSourceDto);
        IncomeSourceDao savedIncomeSourceDao = incomeSourceService.createIncomeSource(incomeSourceDao);
        IncomeSourceDto savedIncomeSourceDto = incomeSourceMapper.mapTo(savedIncomeSourceDao);
    return new ResponseEntity<>(savedIncomeSourceDto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeSourceDto> updateIncomeSource(@Valid @RequestBody IncomeSourceDto incomeSourceDto, @PathVariable UUID id) {
        IncomeSourceDao incomeSourceDao = incomeSourceMapper.mapFrom(incomeSourceDto);
        IncomeSourceDao updatedIncomeSourceDao = incomeSourceService.updateIncomeSource(incomeSourceDao, id);
        IncomeSourceDto updatedIncomeSourceDto = incomeSourceMapper.mapTo(updatedIncomeSourceDao);
        return new ResponseEntity<>(updatedIncomeSourceDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<IncomeSourceDto> deleteIncomeSource(@PathVariable UUID id) {
        incomeSourceService.deleteIncomeSource(id);
        return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
}
