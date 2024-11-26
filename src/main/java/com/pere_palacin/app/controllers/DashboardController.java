package com.pere_palacin.app.controllers;

import com.pere_palacin.app.domains.InvestmentDao;
import com.pere_palacin.app.domains.dto.*;
import com.pere_palacin.app.mappers.impl.InvestmentMapper;
import com.pere_palacin.app.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final InvestmentMapper investmentMapper;

    @GetMapping("/incomes-expenses-graph")
    public List<IncomeAndExpensesChartDto> generateExpensesAndIncomesChartData() {
        return dashboardService.getExpensesAndIncomesChartData();
    }

    @GetMapping("/income-sources-graph")
    public List<IncomeSourceWithAmountDto> generateTopIncomeSources () {
        return dashboardService.getIncomeSourcesChartData();
    }

    @GetMapping("/investment-categories-graph")
    public List<InvestmentCategoriesWithAmountDto> generateTopInvestmentCategories () {
        return dashboardService.findInvestmentCategoriesWithAmounts();
    }

    @GetMapping("/investments-to-expire")
    public List<InvestmentDto> findInvestmentsAboutToExpire() {
        List<InvestmentDao> investmentsAboutToExpire = dashboardService.findInvestmentsAboutToExpire();
        return investmentsAboutToExpire.stream().map(investmentMapper::mapTo).toList();
    }

    @GetMapping("/category-expenses")
    public List<ExpensesCategoryWithAmountDto> generateExpenseCategoriesWithAmount() {
        return dashboardService.generateExpenseCategoriesWithAmount();
    }

}
