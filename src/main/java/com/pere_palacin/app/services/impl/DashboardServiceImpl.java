package com.pere_palacin.app.services.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.pere_palacin.app.domains.InvestmentDao;
import com.pere_palacin.app.domains.dto.*;
import com.pere_palacin.app.repositories.*;
import org.springframework.stereotype.Service;

import com.pere_palacin.app.services.DashboardService;
import com.pere_palacin.app.services.UserDetailsServiceImpl;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final InvestmentCategoryRepository investmentCategoryRepository;
    private final InvestmentRepository investmentRepository;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public List<IncomeAndExpensesChartDto> getExpensesAndIncomesChartData() {
        UUID userId = userDetailsService.getRequestingUserId();
        List<MonthlyIncome> incomesList = incomeRepository.findMonthlyIncomeSummedByUserId(userId);
        List<MonthlyExpenses> expensesList = expenseRepository.findMonthlyExpensesSummedByUserId(userId);
        List<IncomeAndExpensesChartDto> chartData = new ArrayList<>();
        int i = 0;
        int j = 0;
        while (i < expensesList.size() && j < incomesList.size()) {
            if (expensesList.get(i).getYear() < incomesList.get(j).getYear()) {
                chartData.add(IncomeAndExpensesChartDto.builder().expense(expensesList.get(i).getTotalAmount()).income(new BigDecimal(0)).month(expensesList.get(i).getMonth()).year(expensesList.get(i).getYear()).build());
                i++;
            } else if (expensesList.get(i).getYear() > incomesList.get(j).getYear()) {
                chartData.add(IncomeAndExpensesChartDto.builder().income(incomesList.get(j).getTotalAmount()).expense(new BigDecimal(0)).month(incomesList.get(j).getMonth()).year(incomesList.get(j).getYear()).build());
                j++;
            } else {
                if (expensesList.get(i).getMonth() < incomesList.get(j).getMonth()) {
                    chartData.add(IncomeAndExpensesChartDto.builder().expense(expensesList.get(i).getTotalAmount()).income(new BigDecimal(0)).month(expensesList.get(i).getMonth()).year(expensesList.get(i).getYear()).build());
                    i++;
                } else if (expensesList.get(i).getMonth() > incomesList.get(j).getMonth()) {
                    chartData.add(IncomeAndExpensesChartDto.builder().income(incomesList.get(j).getTotalAmount()).expense(new BigDecimal(0)).month(incomesList.get(j).getMonth()).year(incomesList.get(j).getYear()).build());
                    j++;
                } else {
                    chartData.add(IncomeAndExpensesChartDto.builder().expense(expensesList.get(i).getTotalAmount()).income(incomesList.get(j).getTotalAmount()).month(expensesList.get(i).getMonth()).year(expensesList.get(i).getYear()).build());
                    i++;
                    j++;
                }
            }
        }
        if (i < expensesList.size()) {
            for (; i < expensesList.size(); i++) {
                chartData.add(IncomeAndExpensesChartDto.builder().expense(expensesList.get(i).getTotalAmount()).income(new BigDecimal(0)).month(expensesList.get(i).getMonth()).year(expensesList.get(i).getYear()).build());
            }
        }
        if (j < incomesList.size()) {
            for (; j < incomesList.size(); j++) {
                chartData.add(IncomeAndExpensesChartDto.builder().income(incomesList.get(j).getTotalAmount()).expense(new BigDecimal(0)).month(incomesList.get(j).getMonth()).year(incomesList.get(j).getYear()).build());
            }
        }
            return chartData;
        }

    @Override
    public List<IncomeSourceWithAmountDto> getIncomeSourcesChartData() {
        UUID userId = userDetailsService.getRequestingUserId();
        return incomeRepository.findIncomesByCategories(userId);
    }

    @Override
    public List<InvestmentCategoriesWithAmountDto> findInvestmentCategoriesWithAmounts() {
        UUID userId = userDetailsService.getRequestingUserId();
        return investmentCategoryRepository.findInvestmentsByCategories(userId);
    }

    @Override
    public List<InvestmentDao> findInvestmentsAboutToExpire() {
        UUID userId = userDetailsService.getRequestingUserId();
        LocalDate today = LocalDate.now();
        LocalDate after30Days = today.plusDays(30);
        return investmentRepository.findAllByUserIdAndEndDateBetween(userId, today, after30Days);
    }
}
